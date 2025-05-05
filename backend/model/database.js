const commonSettings = {
  seederStorage: 'sequelize',
  seederStorageTableName: 'sequelize_data',
  migrationStorageTableName: 'sequelize_meta',
}

module.exports = {
  development: {
    logging: false,
    dialect: 'postgres',
    username: process.env.PGUSER || process.env.POSTGRES_USER || 'postgres',
    password: process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDB || process.env.POSTGRES_DB || 'future_of_work',
    pool: { max: 20, min: 5, acquire: 60000, idle: 10000 },
    dialectOptions: { ssl: undefined },
    ...commonSettings,
  },
  test: {
    logging: false,
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: undefined,
    },
    ...commonSettings,
  },
  production: {
    logging: false,
    dialect: 'postgres',
    username: process.env.PGUSER || process.env.POSTGRES_USER,
    password: process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD,
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDB || process.env.POSTGRES_DB || 'future_of_work',
    pool: { max: 20, min: 5, acquire: 60000, idle: 10000 },
    dialectOptions: { ssl: undefined },
    ...commonSettings,
  },
}
