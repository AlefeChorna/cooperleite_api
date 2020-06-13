import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IExpensesRepository from '@modules/expenses/repositories/IExpensesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IRuralPropertiesRepository from '@modules/rural-properties/repositories/IRuralPropertiesRepository';
import IVaccinesRepository from '@modules/vaccines/repositories/IVaccinesRepository';
import IProductsReposity from '@modules/products/repositories/IProductsReposity';
import IAnimalsRepository from '@modules/animals/repositories/IAnimalsRepository';
import IAnimalVaccinesRepository from '@modules/animals/repositories/IAnimalVaccinesRepository';

import ExpensesRepository from '@modules/expenses/infra/typeorm/repositories/ExpensesRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';
import RuralPropertiesRepository from '@modules/rural-properties/infra/typeorm/repositories/RuralPropertiesRepository';
import VaccinesRepository from '@modules/vaccines/infra/typeorm/repositories/VaccinesRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import AnimalsRepository from '@modules/animals/infra/typeorm/repositories/AnimalsRepository';
import AnimalVaccinesRepository from '@modules/animals/infra/typeorm/repositories/AnimalVaccinesRepository';

container.registerSingleton<IExpensesRepository>(
  'ExpensesRepository',
  ExpensesRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);

container.registerSingleton<IRuralPropertiesRepository>(
  'RuralPropertiesRepository',
  RuralPropertiesRepository,
);

container.registerSingleton<IVaccinesRepository>(
  'VaccinesRepository',
  VaccinesRepository,
);

container.registerSingleton<IProductsReposity>(
  'ProductsRepository',
  ProductsRepository,
);

container.registerSingleton<IAnimalsRepository>(
  'AnimalsRepository',
  AnimalsRepository,
);

container.registerSingleton<IAnimalVaccinesRepository>(
  'AnimalVaccinesRepository',
  AnimalVaccinesRepository,
);
