require('express-async-errors')
const express = require('express')
const adminRouter = require('./v1/admin')
const appRouter = require('./v1/app')
const error = require('../../middlewares/error')
const {
  setAdminDb,
  resolveSubdomain,
} = require('../../middlewares/connection-resolver')

const router = express.Router()

router.use(setAdminDb)
router.use(resolveSubdomain)
router.use('/admin', adminRouter)
router.use('/app', appRouter)
router.use(error)

module.exports = router
