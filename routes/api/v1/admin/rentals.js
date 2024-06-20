const express = require('express')
const {
  list,
  show,
  create,
  update,
  destroy,
  importRentals,
} = require('../../../../controllers/api/v1/admin/rentals')
const { ensureAuth } = require('../../../../middlewares/ensure-auth')

const app = express.Router()

app.get('/', ensureAuth(['admin', 'creator']), list)
app.get('/:_id', ensureAuth(['admin', 'creator']), show)
app.post('/', ensureAuth(['admin', 'creator']), create)
app.post('/import', ensureAuth(['admin', 'creator']), importRentals)
app.put('/:_id', ensureAuth(['admin', 'creator']), update)
app.delete('/:_id', ensureAuth(['admin', 'creator']), destroy)

module.exports = app
