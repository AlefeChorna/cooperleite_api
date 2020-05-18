import nodemailer, { Transporter } from 'nodemailer';

import IMailProvider from '../models/IMailProvider';

interface IMessage {
  to: string;
  body: string;
}

class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
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

  public async send(to: string, body: string): Promise<void> {
    const message = {
      from: 'Equipe Cooperleite <equipe@cooperleite.com.br>',
      to,
      subject: 'Recuperação de senha',
      text: body,
    };

    const info = await this.client.sendMail(message);

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}

export default EtherealMailProvider
