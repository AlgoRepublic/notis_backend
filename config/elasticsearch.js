const { Client } = require('@elastic/elasticsearch')

const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
  ssl: {
    ca: process.env.ELASTICSEARCH_SSL_CA,
    rejectUnauthorized: true,
  },
})

module.exports = {
  esClient,
}
