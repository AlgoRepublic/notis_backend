const express = require('express')
const {
  list,
  show,
  create,
  update,
  destroy,
} = require('../../../../controllers/api/v1/admin/subdomains')

const app = express.Router()

app.get('/', list)
app.get('/:_id', show)
app.post('/', create)
app.put('/:_id', update)
app.delete('/:_id', destroy)

module.exports = app
