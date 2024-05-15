const express = require('express')
const appsRouter = require('./apps')
const jobsRouter = require('./jobs')

const router = express.Router()

router.use('/apps', appsRouter)
router.use('/jobs', jobsRouter)

module.exports = router
