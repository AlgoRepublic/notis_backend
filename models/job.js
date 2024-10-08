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
      required: true,
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
    jobType: {
      type: String,
      trim: true,
      index: true,
      es_indexed: true,
      es_type: 'keyword',
    },
    workplaceType: {
      type: String,
      trim: true,
      index: true,
      es_indexed: true,
      es_type: 'keyword',
    },
    salary: {
      type: Number,
      trim: true,
      index: true,
      es_indexed: true,
      es_type: 'float',
    },
    salaryCurrencySymbol: {
      type: String,
      trim: true,
      index: true,
      es_indexed: true,
      es_type: 'keyword',
    },
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
