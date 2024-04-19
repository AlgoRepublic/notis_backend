const { getAdminConnection } = require('../utils/connection-manager')

const setAdminDb = (req, res, next) => {
  req.dbConnection = getAdminConnection()

  next()
}

module.exports = { setAdminDb }
