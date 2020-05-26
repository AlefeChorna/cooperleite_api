import fs from 'fs';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime';

import IStorageProvider from '../models/IStorageProvider';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: process.env.AWS_DEFAULT_REGION
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);
    const fileContent = await fs.promises.readFile(originalPath);
    const fileContentType = mime.getType(originalPath);

    if (!fileContentType) {
      throw new AppError('File not found', 422);
    }

    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        ContentType: fileContentType,
        ContentDisposition: `inline; filename=${file}`,
        Body: fileContent
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider
