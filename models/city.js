const mongoose = require('mongoose')
const Schema = mongoose.Schema

const citySchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      index: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: 'Country',
      index: true,
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: 'State',
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = citySchema
