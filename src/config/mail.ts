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
      name: process.env.DEFAULT_EMAIL_NAME,
      email: process.env.DEFAULT_EMAIL_ADDRESS,
    }
  }
} as IMailConfig;
