const { initAdminDbConnection } = require('../config/admin-db')
const { initSubdomainDbConnection } = require('../config/subdomain-db')
const { logInfo } = require('./log')

let connectionMap
let adminDbConnection

const connectAllDb = async () => {
  let subdomains
  const ADMIN_DB_URI = `${process.env.BASE_DB_URI}/${process.env.ADMIN_DB_NAME}`
  adminDbConnection = await initAdminDbConnection(ADMIN_DB_URI)

  try {
    subdomains = await adminDbConnection
      .model('SubDomain')
      .find({})
      .lean()
      .exec()
  } catch (e) {
    console.log('connectAllDb error', e)
    return
  }

  connectionMap = []
  for await (const subdomain of subdomains) {
    connectionMap.push({
      [subdomain.host]: await initSubdomainDbConnection(subdomain.dbURI),
    })
  }

  connectionMap = connectionMap.reduce((prev, next) => {
    return Object.assign({}, prev, next)
  }, {})
}

const getConnectionBySubdomain = async (host) => {
  let subDomainConnection = connectionMap[host]

  if (subDomainConnection !== undefined) {
    return subDomainConnection
  }

  const subDomain = await getAdminConnection()
    .model('SubDomain')
    .findOne({ host: host })
  if (subDomain) {
    subDomainConnection = await initSubdomainDbConnection(subDomain.dbURI)
    connectionMap[subDomain.host] = subDomainConnection
    return subDomainConnection
  }

  return null
}

const getAdminConnection = () => {
  if (adminDbConnection) {
    return adminDbConnection
  }
}

module.exports = {
  connectAllDb,
  getAdminConnection,
  getConnectionBySubdomain,
}
