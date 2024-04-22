const express = require('express')
const authRouter = require('./auth')
const usersRouter = require('./users')
const { ensureAuth } = require('../../../../middlewares/ensure-auth')

const router = express.Router()

router.use('/auth', authRouter)
router.use('/users', ensureAuth('admin'), usersRouter)

module.exports = router
