const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deviceSchema = new Schema(
  {
    fcmToken: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    sendNotification: {
      type: Boolean,
      default: false,
      index: true,
    },
    searches: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Search',
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = deviceSchema
