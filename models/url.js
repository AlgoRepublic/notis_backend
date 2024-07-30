const mongoose = require('mongoose')

const Schema = mongoose.Schema

const urlSchema = new Schema({}, { collection: 'urls', strict: false })

module.exports = urlSchema
