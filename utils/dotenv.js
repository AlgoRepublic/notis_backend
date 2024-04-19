const validNodeEnvList = ['production', 'staging']
let nodeEnv = 'development'
let nodeEnvFile = '.env'

if (validNodeEnvList.includes(process.env.NODE_ENV)) {
  nodeEnv = process.env.NODE_ENV
  nodeEnvFile = '.env.' + process.env.NODE_ENV
}

require('dotenv').config({ path: nodeEnvFile })

process.env.NODE_ENV = nodeEnv
process.env.APP_PORT = process.env.APP_PORT || 3000
