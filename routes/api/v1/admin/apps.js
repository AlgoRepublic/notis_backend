const express = require('express')
const {
  show,
  create,
  update,
} = require('../../../../controllers/api/v1/admin/apps')

const app = express.Router()

app.get('/:_id', show)
app.post('/', create)
app.put('/:_id', update)

module.exports = app
