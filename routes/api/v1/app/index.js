const express = require('express')
const appsRouter = require('./apps')
const jobsRouter = require('./jobs')
const devicesRouter = require('./devices')
const searchesRouter = require('./searches')

const router = express.Router()

router.use('/apps', appsRouter)
router.use('/jobs', jobsRouter)
router.use('/devices', devicesRouter)
router.use('/searches', searchesRouter)

module.exports = router
