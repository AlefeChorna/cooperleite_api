import { EntityRepository, Repository } from 'typeorm';

import Expense from '../models/Expense';

@EntityRepository(Expense)
class ExpensesRepository extends Repository<Expense> {}

export default ExpensesRepository;
