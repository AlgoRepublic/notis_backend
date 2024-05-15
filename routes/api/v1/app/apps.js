const express = require('express')
const { info } = require('../../../../controllers/api/v1/app/apps')

const app = express.Router()

app.get('/info', info)

module.exports = app
