const mongoose = require('mongoose')
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
    console.log('admin  connection ok! : ' + db.name)

    db.model('User', require('../models/user'))
    return db
  } catch (error) {
    console.log('admin error', error)
  }
}

module.exports = {
  initAdminDbConnection,
}
