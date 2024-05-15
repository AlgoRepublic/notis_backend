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
    appType: {
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
    privacyPolicy: {
      type: String,
      required: true,
      trim: true,
    },
    termsOfUse: {
      type: String,
      required: true,
      trim: true,
    },
    copyRightClaim: {
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
