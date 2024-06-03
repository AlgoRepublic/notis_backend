const Queue = require('bull')
const { logError, logInfo } = require('./log')

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env
const redisConfig = {
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
}
const queueJobs = require('../jobs')

const queues = Object.values(queueJobs).map((job) => ({
  bull: new Queue(job.key, { redis: redisConfig }),
  name: job.key,
  handle: job.handle,
  options: job.options,
}))

module.exports = {
  queues,
  add(name, data) {
    const queue = this.queues.find((queue) => queue.name === name)
    return queue.bull.add(data, queue.options)
  },
  async process() {
    return this.queues.forEach((queue) => {
      queue.bull.process(queue.handle)
      queue.bull.on('completed', (job, result) => {
        logInfo({
          key: queue.name,
          data: job.data,
          result,
        })
      })
      queue.bull.on('failed', (job, err) => {
        logError({
          key: queue.name,
          data: job.data,
          err: err,
        })
      })
    })
  },
}
