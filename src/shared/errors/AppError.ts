type Message = string | { [key: string]: string; };

class AppError {
  public readonly message: Message;

  public readonly statusCode: number;

  constructor(message: Message, statsCode = 400) {
    this.message = message;
    this.statusCode = statsCode;
  }
}

export default AppError;
