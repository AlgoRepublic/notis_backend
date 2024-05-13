const express = require('express')
const { list } = require('../../../../controllers/api/v1/admin/countries')
const { ensureAuth } = require('../../../../middlewares/ensure-auth')

const app = express.Router()

app.get('/', ensureAuth('admin'), list)

module.exports = app
