const jwt = require('jsonwebtoken')
const { errorResponse } = require('../utils/response')
const { logError } = require('../utils/log')
const { CustomError } = require('../utils/error')

const ensureAuth = (allowedRoles) => {
  return async (req, res, next) => {
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

        if (!decoded?._id) throw new CustomError('Invalid authorization token')

        if (!Array.isArray(allowedRoles)) {
          allowedRoles = [allowedRoles]
        }

        const query = { _id: decoded._id }

        if (req.subDomain === 'www' || !req.subDomain) {
          query.roles = 'admin'
        } else {
          if (!req.subDomainId) {
            throw new CustomError('Subdomain is not resolved')
          }

          query.roles = 'creator'
          query.subDomains = req.subDomainId
        }

        const user = await connection.model('User').findOne(query).lean().exec()

        if (!user) throw new CustomError('Invalid authorization token')

        const userRoles = user.roles || []
        const matchedRoles = userRoles.filter((value) =>
          allowedRoles.includes(value)
        )

        if (matchedRoles.length === 0) {
          throw new CustomError('User does not have permission to access this')
        }

        req.currentUser = user

        next()
      } catch (err) {
        logError(err)
        return errorResponse(res, err?.message)
      }
    } else {
      return errorResponse(res, 'Authorization token is missing')
    }
  }
}

const ensureSubdomainAccess = async (req, res, next) => {
  try {
    const connection = req.dbConnection
    const currentUser = req.currentUser
    const subDomain = req.subDomain

    if (!currentUser) {
      throw new CustomError('User is not authenticated')
    }

    if (!subDomain) {
      throw new CustomError('Subdomain is not resolved')
    }

    const domain = await connection
      .model('SubDomain')
      .findOne({ host: subDomain })
      .lean()
      .exec()
    if (!domain) {
      throw new CustomError('Subdomain not found')
    }

    const user = await connection
      .model('User')
      .findOne({
        $or: [
          { _id: currentUser._id, subDomains: domain._id },
          { _id: currentUser._id, roles: 'admin' },
        ],
      })
      .lean()
      .exec()

    if (!user) {
      throw new CustomError('User does not have access to this subdomain')
    }

    next()
  } catch (error) {
    logError(error)
    return errorResponse(res, error?.message || 'Invalid subdomain access')
  }
}

module.exports = { ensureAuth, ensureSubdomainAccess }
