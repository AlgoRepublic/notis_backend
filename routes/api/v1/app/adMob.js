const express = require('express')
const ensureSubdomain = require('../../../../middlewares/ensure-subdomain')
const { list } = require('../../../../controllers/api/v1/app/adMob')

const app = express.Router()

app.get('/', ensureSubdomain, list)

module.exports = app
