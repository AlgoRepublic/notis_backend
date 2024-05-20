const express = require('express')

const { create } = require('../../../../controllers/api/v1/admin/contact')
const app = express.Router()

app.post('/', create)

module.exports = app
