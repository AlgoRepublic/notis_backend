const express = require('express')
const { create, update } = require('../../../../controllers/api/v1/admin/apps')

const app = express.Router()

app.post('/', create)
app.put('/:_id', update)

module.exports = app
