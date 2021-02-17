// Require Mongoose so we can use it later in our handlers
const mongoose = require('mongoose');

// Create some custom error types by extending the Javascript
// `Error.prototype` using the ES6 class syntax.  This  allows
// us to add arbitrary data for our status code to the error
// and dictate the name and message.
class BadCredentialsError extends Error {
  constructor() {
    super();
    this.name = 'BadCredentialsError';
    this.statusCode = 422;
    this.message = 'The provided username or password is incorrect';
  }
}

class OwnershipError extends Error {
  constructor() {
    super();
    this.name = 'OwnershipError';
    this.statusCode = 401;
    this.message =
      'The provided token does not match the owner of this document';
  }
}

class DocumentNotFoundError extends Error {
  constructor() {
    super();
    this.name = 'DocumentNotFoundError';
    this.statusCode = 404;
    this.message = "The provided ID doesn't match any documents";
  }
}

class BadParamsError extends Error {
  constructor() {
    super();
    this.name = 'BadParamsError';
    this.statusCode = 422;
    this.message = 'A required parameter was omitted or invalid';
  }
}


class InvalidIdError extends Error {
  constructor() {
    super();
    this.name = 'InvalidIdError';
    this.statusCode = 422;
    this.message = 'Invalid id';
  }
}
