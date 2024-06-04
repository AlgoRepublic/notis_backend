const express = require('express')
const ensureSubdomain = require('../../../../middlewares/ensure-subdomain')
const ensureDevice = require('../../../../middlewares/ensure-device')
const {
  list,
  create,
  clear,
  destroy,
} = require('../../../../controllers/api/v1/app/searches')

const app = express.Router()

app.get('/', ensureSubdomain, ensureDevice, list)
app.post('/', ensureSubdomain, ensureDevice, create)
app.post('/clear', ensureSubdomain, ensureDevice, clear)
app.delete('/:_id', ensureSubdomain, ensureDevice, destroy)

module.exports = app
