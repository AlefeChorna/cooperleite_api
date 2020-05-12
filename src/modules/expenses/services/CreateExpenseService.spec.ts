import MockExpensesRepository from '../repositories/mocks/MockExpensesRepository';
import CreateExpenseService from './CreateExpenseService';

describe('CreateExpenseService', () => {
  it('should be able to create a new expense', async () => {
    const expenseData = {
      name: 'Gasoline',
      value: 50,
      user_id: '1234-asdf-134-asdf'
    };
    const mockExpensesRepository = new MockExpensesRepository();
    const createExpenseService = new CreateExpenseService(mockExpensesRepository);

    const expense = await createExpenseService.execute(expenseData);

    expect(expense).toHaveProperty('id');
    expect(expense.name).toBe(expenseData.name);
    expect(expense.value).toBe(expenseData.value);
    expect(expense.user_id).toBe(expenseData.user_id);
  })
})
