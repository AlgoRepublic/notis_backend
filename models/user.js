const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    roles: [
      {
        type: String,
        enum: ['admin', 'creator'],
        required: true,
        index: true,
      },
    ],
    password: {
      type: String,
      required: true,
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

userSchema.methods.generateAuthToken = function () {
  const maxAge = 3 * 24 * 60 * 60
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.APP_JWT_KEY,
    {
      expiresIn: maxAge,
    }
  )
  return token
}

module.exports = userSchema
