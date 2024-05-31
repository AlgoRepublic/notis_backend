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
  console.log('Mongoose default connection open')
})

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log('Mongoose default connection error: ' + err)
})

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected')
})

const initAdminDbConnection = async (DB_URL) => {
  try {
    const db = await mongoose.createConnection(DB_URL, clientOption).asPromise()

    db.model('User', require('../models/user'))
    db.model('SubDomain', require('../models/subdomain'))
    db.model('Country', require('../models/country'))
    db.model('State', require('../models/state'))
    db.model('City', require('../models/city'))
    db.model('App', require('../models/app'))
    db.model('AdMob', require('../models/adMob'))

    logInfo('Admin connection ok! : ' + db.name)
    return db
  } catch (error) {
    logError('Admin connection error', error)
  }
}

module.exports = {
  initAdminDbConnection,
}
