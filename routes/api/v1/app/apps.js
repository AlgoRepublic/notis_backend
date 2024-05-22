const express = require('express')
const ensureSubdomain = require('../../../../middlewares/ensure-subdomain')
const { info } = require('../../../../controllers/api/v1/app/apps')

const app = express.Router()

app.get('/info', ensureSubdomain, info)

module.exports = app
