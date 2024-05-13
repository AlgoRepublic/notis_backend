const { required } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    app_type: {
      type: String,
      required: true,
      enum: ['Job', 'Rental'],
    },
    subDomain: {
      type: Schema.Types.ObjectId,
      ref: 'SubDomain',
      default: null,
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: 'Country',
      default: null,
    },
    color: {
      primary: {
        type: String,
        required: true,
        trim: true,
      },
      secondary: {
        type: String,
        required: true,
        trim: true,
      },
      text: {
        type: String,
        required: true,
        trim: true,
      },
    },
    privacy_policy: {
      type: String,
      required: true,
      trim: true,
    },
    terms_of_use: {
      type: String,
      required: true,
      trim: true,
    },
    copy_right_claim: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = appSchema
