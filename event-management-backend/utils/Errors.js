class ValidationError extends Error {
  constructor(errors) {
    super();
    this.errors = errors;
    this.name = 'ValidationError'
  }
}

class CustomError extends Error {
  constructor(message1, code, message2 = "") {
    super(message1);
    this.statusCode = code;
    this.message2 = message2;
  }
}

module.exports = {
  ValidationError,
  CustomError,
};
