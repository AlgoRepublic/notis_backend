const mongoose = require('mongoose')
const mongoosastic = require('mongoosastic')
const { esClient } = require('../config/elasticsearch')

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
      required: true,
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

jobSchema.methods.generateIndexName = function () {
  return `jobs-${this.subDomain}`
}

jobSchema.plugin(mongoosastic, { indexAutomatically: false, esClient })

module.exports = jobSchema
