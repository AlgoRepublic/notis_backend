const express = require('express')
const ensureSubdomain = require('../../../../middlewares/ensure-subdomain')
const ensureDevice = require('../../../../middlewares/ensure-device')
const { create } = require('../../../../controllers/api/v1/app/searches')

const app = express.Router()

app.post('/', ensureSubdomain, ensureDevice, create)

module.exports = app
