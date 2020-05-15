import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';

import BCriptHashProvider from './HashProvider/implementations/BCriptHashProvider';

container.registerSingleton<IHashProvider>(
  'HashProvider',
  BCriptHashProvider,
);
