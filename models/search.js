const mongoose = require('mongoose')
const Schema = mongoose.Schema

const searchSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      index: true,
      default: null,
    },
    location: {
      type: String,
      trim: true,
      index: true,
      default: null,
    },
    device: {
      type: Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = searchSchema
