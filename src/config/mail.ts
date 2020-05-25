interface IMailConfig {
  driver: 'ethereal' | 'amazon_ses';
  defaults: {
    from: {
      name: string;
      email: string;
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      name: 'Equipe Cooperleite',
      email: 'no-reply@cooperleite.com',
    }
  }
} as IMailConfig;
