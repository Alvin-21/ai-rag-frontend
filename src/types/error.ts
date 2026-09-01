export class AppError extends Error {
  public readonly status?: number;

  constructor(message: string, status?: number) {
    // Call the parent Error constructor to populate error.message
    super(message);

    // Set the prototype explicitly to maintain correct 'instanceof' checks in compiled ES5/ES6
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = 'AppError';
    this.status = status;

    // Captures standard stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}