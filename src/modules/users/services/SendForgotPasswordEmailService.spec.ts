import AppError from '@shared/errors/AppError';
import MockUsersRepository from '../repositories/mocks/MockUsersRepository';
import MockUserTokensRepository from '../repositories/mocks/MockUserTokensRepository';
import MockMailProvider from '@shared/container/providers/MailProvider/mocks/MockMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let mockUsersRepository: MockUsersRepository;
let mockMailProvider: MockMailProvider;
let mockUserTokensRepository: MockUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    mockUsersRepository = new MockUsersRepository();
    mockMailProvider = new MockMailProvider();
    mockUserTokensRepository = new MockUserTokensRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      mockUsersRepository,
      mockMailProvider,
      mockUserTokensRepository
    );
  })

  it('should be able to recovery the password using the email', async () => {
    const sendEmail = jest.spyOn(mockMailProvider, 'send');

    await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    await sendForgotPasswordEmailService.execute({
      email: 'juca@gmail.com'
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'juca@gmail.com'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(mockUserTokensRepository, 'generate');

    const user = await mockUsersRepository.create({
      name: 'Juca Bala',
      email: 'juca@gmail.com',
      password: '123456'
    });

    await sendForgotPasswordEmailService.execute({
      email: 'juca@gmail.com'
    });

    expect(generateToken).toHaveBeenLastCalledWith(user.id);
  });
})
