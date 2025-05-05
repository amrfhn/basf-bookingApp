const errors = {
  BadRequestError: (res, message) => res.status(400).send({ type: 'BadRequestError', message, code: 400 }),
  UnauthorizedError: (res, message) => res.status(401).send({ type: 'UnauthorizedError', message, code: 401 }),
  ForbiddenError: (res, message) => res.status(403).send({ type: 'ForbiddenError', message, code: 403 }),
  NotFoundError: (res, message) => res.status(404).send({ type: 'NotFoundError', message, code: 404 }),
  ConflictError: (res, message) => res.status(409).send({ type: 'ConflictError', message, code: 409 }),
  InternalServerError: (res, message) => res.status(500).send({ type: 'InternalServerError', message, code: 500 }),
}

module.exports = function CustomException(e) {
  console.error((e.name || 'Generic Error') + ': ' + e.message)
  return errors[e.name] || errors.InternalServerError
}
