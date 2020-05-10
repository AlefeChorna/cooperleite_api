import { EntityRepository, Repository } from 'typeorm';

import Expense from '../infra/typeorm/entities/Expense';

@EntityRepository(Expense)
class ExpensesRepository extends Repository<Expense> {}

export default ExpensesRepository;
