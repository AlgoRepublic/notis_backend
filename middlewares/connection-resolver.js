const {
  getAdminConnection,
  getConnectionBySubdomain,
} = require('../utils/connection-manager')
const { CustomError } = require('../utils/error')
const { logInfo, logError } = require('../utils/log')
const { errorResponse } = require('../utils/response')

const setAdminDb = (req, res, next) => {
  req.dbConnection = getAdminConnection()

  next()
}

const resolveSubdomain = async (req, res, next) => {
  try {
    const vhost = req.vhost
    const subdomain = vhost['0']

    if (subdomain === 'www' || subdomain === '') {
      return next()
    }

    const connection = await getConnectionBySubdomain(subdomain)
    if (!connection) {
      throw new CustomError(`Subdomain ${subdomain} not found`)
    }

    req.sdbConnection = connection
    req.subDomain = subdomain
    req.subDomainId = (
      await getAdminConnection()
        .model('SubDomain')
        .findOne({
          host: subdomain,
        })
        .select({
          _id: 1,
        })
        .lean()
        .exec()
    )._id.toString()

    logInfo(`Resolved subdomain: ${subdomain}`)

    next()
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Invalid subdomain')
  }
}

module.exports = { resolveSubdomain, setAdminDb }
