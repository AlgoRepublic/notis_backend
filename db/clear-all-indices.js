require('../utils/dotenv')
const { esClient } = require('../config/elasticsearch')
const { logInfo, logError } = require('../utils/log')

const clearAllIndices = async () => {
  const indices = await esClient.cat.indices({ format: 'json' })

  for (const index of indices.body) {
    const { index: indexName } = index

    if (indexName.includes('jobs-') || indexName.includes('rentals-')) {
      await esClient.indices.delete({ index: indexName })
      logInfo(`Index ${indexName} has been deleted`)
    }
  }
}

clearAllIndices()
  .then(async () => {
    logInfo(
      'All indices have been cleared. Please ensure to reindex the data before using the application'
    )
    process.exit(0)
  })
  .catch((error) => {
    logError(`Error in clearing all indices: ${error}`)
    process.exit(1)
  })
