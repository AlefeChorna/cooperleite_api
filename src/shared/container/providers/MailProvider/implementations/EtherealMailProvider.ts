import { injectable, inject } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';

import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  private mailTemplateProvider: IMailTemplateProvider;

  constructor(
    @inject('MailTemplateProvider')
    mailTemplateProvider: IMailTemplateProvider
  ) {
    this.mailTemplateProvider = mailTemplateProvider;

    nodemailer.createTestAccount()
      .then(account => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass
          }
        });

        this.client = transporter;
      });
  }

  public async send({ to, from, subject, templateData }: ISendMailDTO): Promise<void> {
    const htmlTemplate = await this.mailTemplateProvider.parse(templateData);
    const message = {
      from: {
        name: from?.name || 'Equipe Cooperleite',
        address: from?.email || 'equipe@cooperleite.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: htmlTemplate,
    };

    const info = await this.client.sendMail(message);

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}

export default EtherealMailProvider
