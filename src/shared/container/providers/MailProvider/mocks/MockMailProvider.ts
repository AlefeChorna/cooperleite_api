import IMailProvider from '../models/IMailProvider';

interface IMessage {
  to: string;
  body: string;
}

class MockMailProvider implements IMailProvider {
  private messages: IMessage[] = [];

  public async send(to: string, body: string): Promise<void> {
    this.messages.push({ to, body });
  }
}

export default MockMailProvider
