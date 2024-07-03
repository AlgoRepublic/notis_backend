global.__basedir = __dirname
require('./utils/dotenv')
const path = require('path')
const vhost = require('vhost')
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const apiRoutes = require('./routes/api')
const queue = require('./utils/bull')
const i18n = require('./utils/i18n')
const { connectAllDb } = require('./utils/connection-manager')
const { firebaseInitialize } = require('./utils/firebase')
const { logInfo } = require('./utils/log')
const app = express()

app.use(cors({ origin: '*' }))
app.use(morgan('tiny'))
app.use(
  express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 })
)
app.use(express.json({ limit: '50mb' }))
app.use(
  fileUpload({
    debug: false,
    parseNested: true,
    createParentPath: true,
    preserveExtension: true,
  })
)
app.use(i18n.init)

app.use(
  '/api/v1',
  vhost(new RegExp(`([a-z0-9]*).?${process.env.APP_HOST}`), apiRoutes)
)
app.use('/storage', express.static(path.join(__dirname, './storage')))

connectAllDb().then(() => {
  app.listen(process.env.APP_PORT, async () => {
    firebaseInitialize()
    queue.process()

    logInfo(
      `App listening on port ${process.env.APP_PORT} in ${process.env.NODE_ENV} environment`
    )
  })
})

process.on('SIGINT', async () => {
  mongoose.connection.close()
  process.exit(0)
})
