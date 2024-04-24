const express = require('express')
const {
  list,
  create,
  update,
} = require('../../../../controllers/api/v1/admin/subdomains')

const app = express.Router()

app.get('/', list)
app.post('/', create)
app.put('/:_id', update)

module.exports = app
