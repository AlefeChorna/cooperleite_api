import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

class MockMailProvider implements IMailProvider {
  private messages: ISendMailDTO[] = [];

  public async send(message: ISendMailDTO): Promise<void> {
    this.messages.push(message);
  }
}

export default MockMailProvider
