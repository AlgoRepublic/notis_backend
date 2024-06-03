const mongoose = require('mongoose')
const Schema = mongoose.Schema

const alertSchema = new Schema(
  {
    viewed: {
      type: Boolean,
      default: false,
    },
    pushNotificationSent: {
      type: Boolean,
      default: false,
    },
    device: {
      type: Schema.Types.ObjectId,
      ref: 'Device',
      index: true,
      required: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      index: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = alertSchema
