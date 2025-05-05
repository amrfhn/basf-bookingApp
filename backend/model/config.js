const { Sequelize, DataTypes, Model } = require('sequelize')

// Singleton Sequelize
let sequelize = null

function getSequelize() {
  if (!sequelize) {
    console.log('Configuring database connection:')

    const config = require('./database')[process.env.NODE_ENV]

    console.log(' - pgHost:', config.host)
    console.log(' - pgPort:', config.port)
    console.log(' - pgDb:', config.database)
    console.log(' - pgUser:', config.username)
    console.log('')

    sequelize = new Sequelize(config)
  }
  return sequelize
}

async function connectDB() {
  try {
    await getSequelize().authenticate()
    console.log('Sequelize: Connection has been established successfully.')
  } catch (e) {
    console.error('Sequelize: Unable to connect to the database:', e)
    process.exit(1)
  }
}

module.exports = {
  DataTypes,
  Model,
  getSequelize,
  connectDB,
}
