class AppError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

module.exports = AppError;
