const mongoose = require('mongoose')
const { elasticsearchPlugin } = require('./helpers/elasticsearch')

const Schema = mongoose.Schema

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
      es_indexed: true,
      es_type: 'text',
    },
    description: {
      type: String,
      required: true,
      trim: true,
      es_indexed: true,
      es_type: 'text',
    },
    entity: {
      type: String,
      trim: true,
      index: true,
      es_indexed: true,
      es_type: 'text',
    },
    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
      es_indexed: true,
      es_type: 'text',
    },
    url: {
      type: String,
      required: true,
      trim: true,
      es_indexed: true,
      es_type: 'text',
    },
    summary: {
      type: String,
      trim: true,
      es_indexed: true,
      es_type: 'text',
    },
    price: {
      type: Number,
      trim: true,
      es_indexed: true,
      es_type: 'float',
    },
    priceCurrencySymbol: {
      type: String,
      trim: true,
      index: true,
      es_indexed: true,
      es_type: 'keyword',
    },
    propertyType: {
      type: String,
      trim: true,
      es_indexed: true,
      es_type: 'keyword',
    },
    thumbnails: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          auto: true,
          es_indexed: true,
          es_type: 'keyword',
        },
        source: {
          type: String,
          required: true,
          enum: ['remote', 'local'],
          es_indexed: true,
          es_type: 'text',
        },
        path: {
          type: String,
          required: true,
          es_indexed: true,
          es_type: 'text',
        },
      },
    ],
    scrapingURLId: {
      type: String,
      index: true,
      es_indexed: true,
      es_type: 'keyword',
    },
    subDomain: {
      type: String,
      required: true,
      trim: true,
      index: true,
      es_indexed: true,
      es_type: 'keyword',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null,
      es_indexed: true,
      es_type: 'keyword',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null,
      es_indexed: true,
      es_type: 'keyword',
    },
    createdOn: {
      type: Date,
      index: true,
      es_type: 'date',
      es_indexed: true,
      default: () => new Date(),
    },
    createdAt: {
      type: Date,
      index: true,
      es_type: 'date',
      es_indexed: true,
    },
    updatedAt: {
      type: Date,
      index: true,
      es_type: 'date',
      es_indexed: true,
    },
  },
  {
    timestamps: true,
  }
)

elasticsearchPlugin(jobSchema)

module.exports = jobSchema
