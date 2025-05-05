const { Router } = require('express')

const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroSequelize = require('@admin-bro/sequelize')

const abEmail = process.env.ADMINBRO_EMAIL || 'bsa-gtu@basf.com'
const abPassword = process.env.ADMINBRO_PASSWORD || 'bsa-gtu@basf.com'
const abCookiePassword = process.env.ADMINBRO_COOKIEPASSWORD || 'some-secret-password-used-to-secure-cookie'

// Admin Panel
AdminBro.registerAdapter(AdminBroSequelize)
const adminBro = require('./schema')('/future_of_work')
const adminController = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    return abEmail === email && abPassword === password
  },
  cookiePassword: abCookiePassword,
})

const router = Router()

router.use(adminBro.options.rootPath, adminController)

module.exports = router
