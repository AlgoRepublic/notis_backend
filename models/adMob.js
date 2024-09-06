const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adMobSchema = new Schema(
  {
    adType: {
      type: String,
      enum: ['Interstitial', 'Native', 'Rewarded', 'OpenAd'],
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    subDomains: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SubDomain',
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = adMobSchema
