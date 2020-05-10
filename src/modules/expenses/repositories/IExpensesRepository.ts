import Expense from '../infra/typeorm/entities/Expense';
import ICreateExpenseDTO from '../dtos/ICreateExpenseDTO';

export default interface IExpensesRepository {
  create(data: ICreateExpenseDTO): Promise<Expense>;
}
