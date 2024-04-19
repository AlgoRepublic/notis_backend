require('express-async-errors')
const express = require('express')
const adminRouter = require('./v1/admin')
const error = require('../../middlewares/error')
const { setAdminDb } = require('../../middlewares/connection-resolver')

const router = express.Router()

router.use('/admin', setAdminDb, adminRouter)
router.use(error)

module.exports = router
