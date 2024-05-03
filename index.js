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
const { connectAllDb } = require('./utils/connection-manager')
const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(
  express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 })
)
app.use(express.json({ limit: '50mb' }))
app.use(
  fileUpload({
    debug: true,
    parseNested: true,
    createParentPath: true,
    preserveExtension: true,
  })
)

app.use('/api/v1', vhost(process.env.APP_HOST || 'localhost', apiRoutes))
app.use('/storage', express.static(path.join(__dirname, './storage')))

connectAllDb().then(() => {
  app.listen(process.env.APP_PORT, () => {
    console.log(
      `App listening on port ${process.env.APP_PORT} in ${process.env.NODE_ENV} environment`
    )
  })
})

process.on('SIGINT', async () => {
  mongoose.connection.close()
  process.exit(0)
})
