const express = require('express')
const { login } = require('../../../../controllers/api/v1/admin/auth')

const app = express.Router()

app.post('/login', login)

module.exports = app
