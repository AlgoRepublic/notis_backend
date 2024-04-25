const express = require('express')
const authRouter = require('./auth')
const usersRouter = require('./users')
const subdomainsRouter = require('./subdomains')
const countriesRouter = require('./countries')
const { ensureAuth } = require('../../../../middlewares/ensure-auth')

const router = express.Router()

router.use('/auth', authRouter)
router.use('/users', ensureAuth('admin'), usersRouter)
router.use('/subdomains', ensureAuth('admin'), subdomainsRouter)
router.use('/countries', ensureAuth('admin'), countriesRouter)

module.exports = router
