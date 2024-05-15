const express = require('express')
const authRouter = require('./auth')
const usersRouter = require('./users')
const subdomainsRouter = require('./subdomains')
const countriesRouter = require('./countries')
const citiesRouter = require('./cities')
const appsRouter = require('./apps')
const jobsRouter = require('./jobs')

const router = express.Router()

router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/subdomains', subdomainsRouter)
router.use('/countries', countriesRouter)
router.use('/cities', citiesRouter)
router.use('/apps', appsRouter)
router.use('/jobs', jobsRouter)

module.exports = router
