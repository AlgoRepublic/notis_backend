const express = require('express')
const { list, create } = require('../../../../controllers/api/v1/admin/users')

const app = express.Router()

app.get('/', list)
app.post('/', create)

module.exports = app
