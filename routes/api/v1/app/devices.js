const express = require('express')
const ensureSubdomain = require('../../../../middlewares/ensure-subdomain')
const ensureDevice = require('../../../../middlewares/ensure-device')
const { info, update } = require('../../../../controllers/api/v1/app/devices')

const app = express.Router()

app.get('/info', ensureSubdomain, ensureDevice, info)
app.put('/', ensureSubdomain, update)

module.exports = app
