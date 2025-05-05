class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'BadRequestError'
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ConflictError'
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ForbiddenError'
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InternalServerError'
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
}
