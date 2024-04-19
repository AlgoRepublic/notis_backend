const jwt = require('jsonwebtoken')
const { errorResponse } = require('../utils/response')

const ensureAuth = async (req, res, next) => {
  const connection = req.dbConnection

  const token = req?.header('Authorization')

  if (token) {
    try {
      let decoded = null
      try {
        decoded = await jwt.verify(token, process.env.APP_JWT_KEY)
      } catch (err) {
        return errorResponse(res, 'Invalid authorization token')
      }

      if (!decoded?._id) throw new Error('Invalid authorization token')

      const user = await connection.model('User').findOne({ _id: decoded._id })

      if (!user) throw new Error('Invalid authorization token')

      req.currentUser = user

      next()
    } catch (err) {
      return errorResponse(res, err?.message)
    }
  } else {
    return errorResponse(res, 'Authorization token is missing')
  }
}

module.exports = { ensureAuth }
