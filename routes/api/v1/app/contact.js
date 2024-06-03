const express = require('express')

const { send } = require('../../../../controllers/api/v1/app/contact')
const app = express.Router()

app.post('/', send)

module.exports = app
