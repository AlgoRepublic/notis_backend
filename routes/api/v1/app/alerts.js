const express = require('express')
const ensureSubdomain = require('../../../../middlewares/ensure-subdomain')
const ensureDevice = require('../../../../middlewares/ensure-device')
const {
  list,
  update,
  clear,
} = require('../../../../controllers/api/v1/app/alerts')

const app = express.Router()

app.get('/', ensureSubdomain, ensureDevice, list)
app.put('/:_id', ensureSubdomain, ensureDevice, update)
app.post('/clear', ensureSubdomain, ensureDevice, clear)

module.exports = app
