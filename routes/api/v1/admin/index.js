const express = require('express')
const authRouter = require('./auth')
const usersRouter = require('./users')
const subdomainsRouter = require('./subdomains')
const { ensureAuth } = require('../../../../middlewares/ensure-auth')

const router = express.Router()

router.use('/auth', authRouter)
router.use('/users', ensureAuth('admin'), usersRouter)
router.use('/subdomains', ensureAuth('admin'), subdomainsRouter)

module.exports = router
