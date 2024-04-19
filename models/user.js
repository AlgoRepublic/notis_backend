const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')
const { encryptPassword } = require('../utils/password')

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    deleted_at: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', async function (next) {
  // only hash the password if it has been modified (or is new)
  if (this.isModified('password')) {
    this.password = await encryptPassword(this.password)
  }

  return next()
})

userSchema.methods.generateAuthToken = function () {
  const maxAge = 3 * 24 * 60 * 60
  const token = jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    process.env.APP_JWT_KEY,
    {
      expiresIn: maxAge,
    }
  )
  return token
}

module.exports = userSchema
