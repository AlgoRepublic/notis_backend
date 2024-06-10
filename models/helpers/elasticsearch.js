const mongoosastic = require('mongoosastic')
const { esClient } = require('../../config/elasticsearch')

const esIndexName = (collection, subDomain) => {
  if (!collection) throw new Error('collection is required')
  if (!subDomain) throw new Error('subDomain is required')

  return `${collection}-${subDomain.toString()}`
}

const elasticsearchPlugin = (schema) => {
  schema.plugin(mongoosastic, { indexAutomatically: false, esClient })

  schema.methods.indexName = function () {
    return esIndexName(this.collection.collectionName, this.subDomain)
  }

  schema.statics.indexName = function (subDomain) {
    return esIndexName(this.collection.name, subDomain)
  }

  schema.methods.addIndex = async function () {
    return await this.index({ index: this.indexName() })
  }

  schema.methods.removeIndex = async function () {
    return await this.esClient().delete(
      { id: this._id.toString(), index: this.indexName() },
      {}
    )
  }
}

module.exports = {
  esIndexName,
  elasticsearchPlugin,
}
