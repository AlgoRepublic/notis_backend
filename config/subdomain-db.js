const mongoose = require('mongoose')
const { logInfo, logError } = require('../utils/log')
mongoose.Promise = global.Promise

const clientOption = {
  socketTimeoutMS: 30000,
  useNewUrlParser: true,
}

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  logInfo('Mongoose default connection open')
})

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  logError('Mongoose default connection error: ', err)
})

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  logInfo('Mongoose default connection disconnected')
})

const initSubdomainDbConnection = async (DB_URL) => {
  try {
    const db = await mongoose.createConnection(DB_URL, clientOption).asPromise()

    db.model('Job', require('../models/job'))
    db.model('Device', require('../models/device'))
    db.model('Search', require('../models/search'))
    db.model('Alert', require('../models/alert'))
    db.model('Rental', require('../models/rental'))

    logInfo('SubDomain connection ok! : ' + db.name)

    return db
  } catch (error) {
    logError('SubDomain connection error', error)
  }
}

module.exports = {
  initSubdomainDbConnection,
}
