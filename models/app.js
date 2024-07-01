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
      trim: true,
    },
    appType: {
      type: String,
      required: true,
      enum: ['Job', 'Rental'],
      index: true,
    },
    subDomain: {
      type: Schema.Types.ObjectId,
      ref: 'SubDomain',
      default: null,
      index: true,
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: 'Country',
      default: null,
      index: true,
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
    adsEnabled: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = appSchema
