const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const swagger = require('swagger-ui-express')
const fileUpload = require('express-fileupload')
const jsdoc = require('swagger-jsdoc')


// To parse file on request
function fileParser() {
  return fileUpload({
    createParentPath: true,
  })
}

// End route
const endRoute = (req, res) => {
  return res.status(404).send('Endpoint not found').end()
}
// Custom Cors
const corsOptions = {
  exposedHeaders: 'x-page,x-per-page,x-total,x-total-pages'
}

// Logger Configuration
morgan.token('method', (r) => r.method.padEnd(5, ' '))
morgan.token('url', (r) => r.originalUrl.padEnd(60, ' '))
morgan.token('date', () => new Date().toLocaleDateString())
morgan.token('time', () => new Date().toLocaleTimeString())

const logger = morgan(':date | :time | :method :url :status :res[content-length] - :response-time ms')

// Swagger config
const optionsSwagger = {
  definition: {
    openapi: '3.0.0',
    info: {
      description: 'This will be used to book seats at the office',
      version: '1.0.0',
      title: 'Future of Work',
      contact: {
        email: 'bsa-gtu-all@basf.com',
      },
    },
  },
  // Where are located the @swagger files - Must be 'Absolute' path
  apis: ['./model/entities/*.js', './api/routes/*.js'],
}

optionsSwagger.definition.servers = [
  {
    url: 'http://localhost:9000/future_of_work',
    description: 'Local Environment ',
  },
  {
    url: 'https://app-dev.roqs.basf.net/future_of_work',
    description: 'Development server (unstable data)',
  },
  {
    url: 'https://app-qa.roqs.basf.net/future_of_work',
    description: 'Testing server (uses test data)',
  },
  {
    url: 'https://app.roqs.basf.net/future_of_work',
    description: 'Production server (uses live data)',
  },
]

const specs = jsdoc(optionsSwagger)
const swaggerConf = swagger.setup(specs)

module.exports = { logger, bodyParser, fileParser, cors, corsOptions, swagger, swaggerConf, endRoute }
