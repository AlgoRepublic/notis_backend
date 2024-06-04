const express = require('express')
const ensureSubdomain = require('../../../../middlewares/ensure-subdomain')
const ensureDevice = require('../../../../middlewares/ensure-device')
const {
  list,
  create,
  clear,
} = require('../../../../controllers/api/v1/app/searches')

const app = express.Router()

app.get('/', ensureSubdomain, ensureDevice, list)
app.post('/', ensureSubdomain, ensureDevice, create)
app.post('/clear', ensureSubdomain, ensureDevice, clear)

module.exports = app
