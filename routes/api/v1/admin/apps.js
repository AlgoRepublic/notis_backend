const express = require('express')
const {
  show,
  create,
  update,
} = require('../../../../controllers/api/v1/admin/apps')
const { ensureAuth } = require('../../../../middlewares/ensure-auth')

const app = express.Router()

app.get('/:_id', ensureAuth('admin'), show)
app.post('/', ensureAuth('admin'), create)
app.put('/:_id', ensureAuth('admin'), update)

module.exports = app
