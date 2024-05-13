const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stateSchema = new Schema(
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
    code: {
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
    cities: [
      {
        type: Schema.Types.ObjectId,
        ref: 'City',
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = stateSchema
