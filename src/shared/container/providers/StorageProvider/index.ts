import { container } from 'tsyringe';

import uploadConfig from '@config/upload';

import IStorageProvider from './models/IStorageProvider';
import DiskStorageProvider from './implementations/DiskStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';

const providers = {
  amazon_s3: S3StorageProvider,
  disk: DiskStorageProvider,
}

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.drive],
);
