const { errorResponse } = require('../utils/response')
const { logError } = require('../utils/log')
const { CustomError } = require('../utils/error')

const ensureSubdomain = async (req, res, next) => {
  try {
    const connection = req.sdbConnection

    if (!connection) {
      throw new CustomError('Invalid domain')
    }

    next()
  } catch (error) {
    logError(error)
    return errorResponse(res, error?.message)
  }
}

module.exports = ensureSubdomain
