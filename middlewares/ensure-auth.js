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
          return errorResponse(res, req.t('38'))
        }

        if (!decoded?._id) throw new CustomError(req.t('38'))

        if (!Array.isArray(allowedRoles)) {
          allowedRoles = [allowedRoles]
        }

        const query = {
          $or: [
            {
              _id: decoded._id,
              roles: 'admin',
            },
            ...(req.subDomainId
              ? [
                  {
                    _id: decoded._id,
                    roles: 'creator',
                    subDomains: req.subDomainId,
                  },
                ]
              : []),
          ],
        }

        // if (req.subDomain === 'www' || !req.subDomain) {
        //   query.roles = 'admin'
        // } else {
        //   if (!req.subDomainId) {
        //     throw new CustomError('Subdomain is not resolved')
        //   }

        //   query.roles = 'creator'
        //   query.subDomains = req.subDomainId
        // }

        const user = await connection.model('User').findOne(query).lean().exec()

        if (!user) throw new CustomError(req.t('38'))

        const userRoles = user.roles || []
        const matchedRoles = userRoles.filter((value) =>
          allowedRoles.includes(value)
        )

        if (matchedRoles.length === 0) {
          throw new CustomError(req.t('39'))
        }

        req.currentUser = user

        next()
      } catch (err) {
        logError(err)
        return errorResponse(res, err?.message)
      }
    } else {
      return errorResponse(res, req.t('40'))
    }
  }
}

const ensureSubdomainAccess = async (req, res, next) => {
  try {
    const connection = req.dbConnection
    const currentUser = req.currentUser
    const subDomain = req.subDomain

    if (!currentUser) {
      throw new CustomError(req.t('41'))
    }

    if (!subDomain) {
      throw new CustomError(req.t('42'))
    }

    const domain = await connection
      .model('SubDomain')
      .findOne({ host: subDomain })
      .lean()
      .exec()
    if (!domain) {
      throw new CustomError(req.t('36'))
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
      throw new CustomError(req.t('34'))
    }

    next()
  } catch (error) {
    logError(error)
    return errorResponse(res, error?.message || req.t('44'))
  }
}

module.exports = { ensureAuth, ensureSubdomainAccess }
