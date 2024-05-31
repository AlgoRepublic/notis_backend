const express = require('express')
const appsRouter = require('./apps')
const jobsRouter = require('./jobs')
const devicesRouter = require('./devices')
const searchesRouter = require('./searches')
const contactRouter = require('./contact')

const router = express.Router()

router.use('/apps', appsRouter)
router.use('/jobs', jobsRouter)
router.use('/devices', devicesRouter)
router.use('/searches', searchesRouter)
router.use('/contact', contactRouter)

module.exports = router
