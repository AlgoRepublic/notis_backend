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
      default: null,
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: 'State',
      index: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = citySchema
