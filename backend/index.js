const { default: axios } = require('axios')
const mode = process.env.NODE_ENV || 'development'
process.env.NODE_ENV = mode
const MACROKIOSK_API_ENDPOINT = process.env.MACROKIOSK_API_ENDPOINT

console.log('Starting Application')

console.log(' - NODE_ENV:', process.env.NODE_ENV)
console.log(' - NODE_EXTRA_CA_CERTS:', process.env.NODE_EXTRA_CA_CERTS)
console.log(' - ROOT_PATH:', process.env.ROOT_PATH)
console.log('')

const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { logger, bodyParser, fileParser, cors, corsOptions, swagger, swaggerConf } = require('./api/config')
const auth = require('./api/auth/authenticate')

const rootPath = process.env.ROOT_PATH || ''
const port = process.env.PORT || 9000

const app = express()

// Make sure disclosing the fingerprinting
app.disable('x-powered-by')

// Admin Panel
app.use(require('./admin'))

app.use(logger)

// API
const api = express.Router()
api.use(cors(corsOptions))
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ limit: '5mb' }))
api.use(fileParser())
const macroKioskClientProxy = createProxyMiddleware({
  target: MACROKIOSK_API_ENDPOINT, // target host with the same base path
  changeOrigin: true, // needed for virtual hosted sites
})

api.use('/auth', auth.enticate, auth.orize, require('./api/routes/Auth'))
api.use('/areas', auth.enticate, auth.orize, require('./api/routes/Areas'))
api.use('/amenities', auth.enticate, auth.orize, require('./api/routes/Amenities'))
api.use('/bookings', auth.enticate, auth.orize, require('./api/routes/Bookings'))
api.use('/buildings', auth.enticate, auth.orize, require('./api/routes/Buildings'))
api.use('/floors', auth.enticate, auth.orize, require('./api/routes/Floors'))
api.use('/sites', auth.enticate, auth.orize, require('./api/routes/Sites'))
api.use('/brigadiers', auth.enticate, auth.orize, require('./api/routes/Brigadiers'))
api.use('/feedbacks', auth.enticate, auth.orize, require('./api/routes/Feedbacks'))
api.use('/reports', auth.enticate, auth.orize, require('./api/routes/Reports'))
api.use('/workStream', auth.enticate, auth.orize, require('./api/routes/WorkStreams'))
api.use('/hood', auth.enticate, auth.orize, require('./api/routes/Hoods'))
api.use('/seats', auth.enticate, auth.orize, require('./api/routes/Seats'))
api.use('/userParkingAccesses', auth.enticate, auth.orize, require('./api/routes/UserParkingAccesses'))
api.use('/bmInterop', auth.enticateClientCredentials, auth.orizeClientCredentials, require('./api/routes/BMInterop'))
api.use('/seat-owner', auth.enticate, auth.orize, require('./api/routes/SeatOwners'))
api.use('/a360Interop', auth.enticateClientCredentials, auth.orizeClientCredentials, require('./api/routes/CheckIn'))
api.use(
  '/notifications',
  macroKioskClientProxy,
  auth.enticateClientCredentials,
  auth.orizeClientCredentials,
  require('./api/routes/Notifications')
)
api.use('/userDetails', auth.enticate, auth.orize, require('./api/routes/UserDetails'))

// Place Swagger at the root (after setting the endpoints)
api.use('/', swagger.serve, swaggerConf)

app.use(rootPath + '/api/', api)
app.use(rootPath + '/mobile/api/', api)

// Resources proxy
const resources = express.Router()
resources.use('/resources', require('./api/proxy/resources'))

app.use(rootPath + '/', resources)
app.use(rootPath + '/mobile/', resources)
app.use(rootPath, express.static('static'))
app.use(rootPath + '/data/', express.static('/ext_data'))

const { connectDB } = require('./model/config')

// Wait Sequelize connection
connectDB().then(() =>
  // To start the server
  app.listen(port, () => console.log(`App listening on port: ${port} - path: '${rootPath}' - mode: '${mode}'`))
)

// Needed to launch the scheduler
require('./controllers/SchedulerController')
