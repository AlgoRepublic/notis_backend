const express = require('express')
const appsRouter = require('./apps')
const jobsRouter = require('./jobs')
const devicesRouter = require('./devices')
const searchesRouter = require('./searches')
const contactRouter = require('./contact')
const alertsRouter = require('./alerts')
const adMobRouter = require('./adMob')
const rentalsRouter = require('./rentals')
const feedbackRouter = require('./feedback')

const router = express.Router()

router.use('/apps', appsRouter)
router.use('/jobs', jobsRouter)
router.use('/devices', devicesRouter)
router.use('/searches', searchesRouter)
router.use('/contact', contactRouter)
router.use('/alerts', alertsRouter)
router.use('/adMob', adMobRouter)
router.use('/rentals', rentalsRouter)
router.use('/feedback', feedbackRouter)

module.exports = router
