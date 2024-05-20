const express = require('express')

const { send } = require('../../../../controllers/api/v1/admin/contact')
const app = express.Router()

app.post('/', send)

module.exports = app
