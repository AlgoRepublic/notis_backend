// const tenantService = require('../services/tenant')
const { initAdminDbConnection } = require('../config/admin-db')

let adminDbConnection

const connectAllDb = async () => {
  const ADMIN_DB_URI = `${process.env.BASE_DB_URI}/${process.env.ADMIN_DB_NAME}`
  adminDbConnection = await initAdminDbConnection(ADMIN_DB_URI)
}

const getAdminConnection = () => {
  if (adminDbConnection) {
    return adminDbConnection
  }
}

module.exports = {
  connectAllDb,
  getAdminConnection,
}
