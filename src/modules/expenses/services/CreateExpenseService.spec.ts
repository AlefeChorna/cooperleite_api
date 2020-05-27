import MockExpensesRepository from '../repositories/mocks/MockExpensesRepository';
import MockNotificationsRepository from '@modules/notifications/repositories/mocks/MockNotificationsRepository';
import CreateExpenseService from './CreateExpenseService';

describe('CreateExpenseService', () => {
  it('should be able to create a new expense', async () => {
    const expenseData = {
      name: 'Gasoline',
      value: 50,
      company_id: '1234-asdf-134-asdf'
    };
    const mockExpensesRepository = new MockExpensesRepository();
    const mockNotificationsRepository = new MockNotificationsRepository();
    const createExpenseService = new CreateExpenseService(
      mockExpensesRepository,
      mockNotificationsRepository
    );

    const expense = await createExpenseService.execute(expenseData);

    expect(expense).toHaveProperty('id');
    expect(expense.name).toBe(expenseData.name);
    expect(expense.value).toBe(expenseData.value);
    expect(expense.company_id).toBe(expenseData.company_id);
  })
})
