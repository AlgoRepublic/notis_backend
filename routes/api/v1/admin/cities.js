const express = require('express')
const { list } = require('../../../../controllers/api/v1/admin/cities')

const app = express.Router()

app.get('/', list)

module.exports = app
