import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const uploadsFolder = path.resolve(tmpFolder, 'uploads');

interface IUploadConfig {
  drive: 'amazon_s3' | 'disk';
  tmpFolder: string;
  uploadsFolder: string;
  config: {
    multer: {
      storage: StorageEngine
    };
    aws: {
      bucket: string;
    }
  };
}

export default {
  drive: process.env.STORAGE_DRIVER || 'disk',
  tmpFolder,
  uploadsFolder,
  config: {
    multer: {
      storage: multer.diskStorage({
        destination: tmpFolder,
        filename(request, file, callback): void {
          const fileHash = crypto.randomBytes(10).toString('HEX');
          const fileName = `${fileHash}-${file.originalname}`;

          callback(null, fileName);
        },
      }),
    },
    aws: {
      bucket: process.env.AWS_S3_BUCKET
    },
  },
} as IUploadConfig;
