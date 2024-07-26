const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subDomainSchema = new Schema(
  {
    recordId: {
      type: Number,
      required: true,
      index: true,
      unique: true,
    },
    domainName: {
      type: String,
      required: true,
      trim: true,
      index: true,
      lowercase: true,
    },
    host: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    fqdn: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'NS', 'SRV', 'SOA', 'CAA'],
      required: true,
      index: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    ttl: {
      type: Number,
      required: true,
      index: true,
    },
    dbURI: {
      type: String,
      required: true,
      index: true,
    },
    subDomainURL: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    searchEngineURLs: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: Boolean,
      default: true,
      index: true,
    },
    app: {
      type: Schema.Types.ObjectId,
      ref: 'App',
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = subDomainSchema
