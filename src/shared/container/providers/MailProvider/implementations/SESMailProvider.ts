import { injectable, inject } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';

import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import mailConfig from '@config/mail';

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter;

  private mailTemplateProvider: IMailTemplateProvider;

  constructor(
    @inject('MailTemplateProvider')
    mailTemplateProvider: IMailTemplateProvider
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: process.env.AWS_DEFAULT_REGION
      })
    });

    this.mailTemplateProvider = mailTemplateProvider;
  }

  public async send({
    to,
    from,
    subject,
    templateData
  }: ISendMailDTO): Promise<void> {
    const htmlTemplate = await this.mailTemplateProvider.parse(templateData);
    const message = {
      from: {
        name: from?.name || mailConfig.defaults.from.name,
        address: from?.email || mailConfig.defaults.from.email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: htmlTemplate,
    };

    await this.client.sendMail(message);
  }
}

export default SESMailProvider
