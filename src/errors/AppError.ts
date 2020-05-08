class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  constructor(message: string, statsCode = 400) {
    this.message = message;
    this.statusCode = statsCode;
  }
}

export default AppError;
