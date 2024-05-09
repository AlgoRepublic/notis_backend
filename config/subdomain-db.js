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

const initSubdomainDbConnection = async (DB_URL) => {
  try {
    const db = await mongoose.createConnection(DB_URL, clientOption).asPromise()

    db.model('Post', require('../models/post'))

    logInfo('SubDomain connection ok! : ' + db.name)

    return db
  } catch (error) {
    logError('SubDomain connection error', error)
  }
}

module.exports = {
  initSubdomainDbConnection,
}
