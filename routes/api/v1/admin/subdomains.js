const express = require('express')
const {
  list,
  show,
  info,
  create,
  update,
  destroy,
} = require('../../../../controllers/api/v1/admin/subdomains')
const { ensureAuth } = require('../../../../middlewares/ensure-auth')

const app = express.Router()

app.get('/', ensureAuth('admin'), list)
app.get('/info', ensureAuth('creator'), info)
app.get('/:_id', ensureAuth('admin'), show)
app.post('/', ensureAuth('admin'), create)
app.put('/:_id', ensureAuth('admin'), update)
app.delete('/:_id', ensureAuth('admin'), destroy)

module.exports = app
