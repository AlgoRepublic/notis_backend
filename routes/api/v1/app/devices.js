const express = require('express')
const { update } = require('../../../../controllers/api/v1/app/devices')

const app = express.Router()

app.put('/', update)

module.exports = app
