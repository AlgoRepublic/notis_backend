const express = require('express')
const { list } = require('../../../../controllers/api/v1/app/jobs')

const app = express.Router()

app.get('/', list)

module.exports = app
