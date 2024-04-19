const { CustomError } = require('../utils/error')
const { errorResponse } = require('../utils/response')
const { logError } = require('../utils/log')

module.exports = (err, req, res, next) => {
  let message = null
  let statusCode = null

  if (err instanceof CustomError) {
    message = err?.message
    statusCode = err?.statusCode
  } else {
    message = 'Internal server error'
    statusCode = 500
  }

  logError(err)
  return errorResponse(res, message, statusCode)
}
