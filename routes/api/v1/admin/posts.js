const express = require('express')
const {
  list,
  show,
  create,
  update,
  destroy,
} = require('../../../../controllers/api/v1/admin/posts')
const { ensureAuth } = require('../../../../middlewares/ensure-auth')

const app = express.Router()

app.get('/', ensureAuth(['admin', 'creator']), list)
app.get('/:_id', ensureAuth(['admin', 'creator']), show)
app.post('/', ensureAuth(['admin', 'creator']), create)
app.put('/:_id', ensureAuth(['admin', 'creator']), update)
app.delete('/:_id', ensureAuth(['admin', 'creator']), destroy)

module.exports = app
