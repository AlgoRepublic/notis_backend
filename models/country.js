const mongoose = require('mongoose')
const Schema = mongoose.Schema

const countrySchema = new Schema(
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
      unique: true,
    },
    iso2: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    iso3: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    states: [
      {
        type: Schema.Types.ObjectId,
        ref: 'State',
      },
    ],
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

module.exports = countrySchema
