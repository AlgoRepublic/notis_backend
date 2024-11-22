const express = require('express')

const { send } = require('../../../../controllers/api/v1/app/feedback')
const app = express.Router()

app.post('/send', send)

module.exports = app
