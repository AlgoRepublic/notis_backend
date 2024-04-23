require('./utils/dotenv')
const vhost = require('vhost')
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const multer = require('multer')
const cors = require('cors')
const upload = multer()
const apiRoutes = require('./routes/api')
const { connectAllDb } = require('./utils/connection-manager')
const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(
  express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 })
)
app.use(express.json({ limit: '50mb' }))
app.use(upload.any())

app.use('/api/v1', vhost(process.env.APP_HOST || 'localhost', apiRoutes))

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
