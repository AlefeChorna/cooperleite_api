import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IExpensesRepository from '@modules/expenses/repositories/IExpensesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import ExpensesRepository from '@modules/expenses/infra/typeorm/repositories/ExpensesRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

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
