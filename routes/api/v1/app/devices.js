const express = require('express')
const ensureSubdomain = require('../../../../middlewares/ensure-subdomain')
const { update } = require('../../../../controllers/api/v1/app/devices')

const app = express.Router()

app.put('/', ensureSubdomain, update)

module.exports = app
