import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IExpensesRepository from '@modules/expenses/repositories/IExpensesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IRuralPropertiesRepository from '@modules/rural-properties/repositories/IRuralPropertiesRepository';

import ExpensesRepository from '@modules/expenses/infra/typeorm/repositories/ExpensesRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';
import RuralPropertiesRepository from '@modules/rural-properties/infra/typeorm/repositories/RuralPropertiesRepository';

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
