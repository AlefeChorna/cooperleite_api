import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IExpensesRepository from '@modules/expenses/repositories/IExpensesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ExpensesRepository from '@modules/expenses/infra/typeorm/repositories/ExpensesRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

container.registerSingleton<IExpensesRepository>(
  'ExpensesRepository',
  ExpensesRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
