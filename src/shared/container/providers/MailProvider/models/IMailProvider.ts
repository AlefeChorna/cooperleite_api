import ISendMailDTO from '../../MailProvider/dtos/ISendMailDTO';

export default interface IMailProvider {
  send(data: ISendMailDTO): Promise<void>
}
