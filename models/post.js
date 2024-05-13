const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    entity: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = postSchema
