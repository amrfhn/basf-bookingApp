const { returning } = require('./common')
const fs = require('fs').promises

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const options = { transaction, returning }

    await queryInterface.sequelize.query(
      `WITH numberschange AS (
          SELECT ID
          FROM "amenityValues"
          WHERE value LIKE '%.%'
        )
        UPDATE "amenityValues" aV
        SET "value" = REPLACE("value", '.', ',')
          FROM numberschange
        WHERE aV.id = numberschange.id;`,
      options
    )

    await queryInterface.sequelize.query(
      `WITH HPchange AS (
          SELECT ID
          FROM "amenityValues"
          WHERE value LIKE 'HP USB-C%'
        )
        UPDATE "amenityValues" aV
        SET "value" = 'HP 2013, USB-C'
          FROM HPchange
        WHERE aV.id = HPchange.id;`,
      options
    )

    await queryInterface.sequelize.query(
      `WITH valuechange AS (
          SELECT ID
          FROM "amenityValues"
          WHERE value LIKE 'HP2013%'
        )
        UPDATE "amenityValues" aV
        SET "value" = 'HP 2013'
          FROM valuechange
        WHERE aV.id = valuechange.id;`,
      options
    )

    await queryInterface.sequelize.query(
      `WITH blacklist AS (
              SELECT * FROM (
      SELECT id, min(id) OVER (PARTITION BY "amenityId", LOWER(TRIM(value))) AS master_id
      FROM "amenityValues"
          ) sub WHERE id <> master_id
          )
        UPDATE "seatAmenityMultiValues" amv
      SET "amenityValueId" = b.master_id
      FROM blacklist b
      WHERE b.id = amv."amenityValueId"
      `,
      options
    )

    await queryInterface.sequelize.query(
      `WITH blacklist AS (
              SELECT * FROM (
      SELECT ID, min(ID) OVER (PARTITION BY "amenityId", LOWER(TRIM(value))) AS master_id
      FROM "amenityValues"
          ) sub WHERE id <> master_id
          )
      DELETE FROM "amenityValues" t
      USING blacklist b
      WHERE b.id = t.id;`,
      options
    )

    await transaction.commit()
  },
  down: async () => {},
}
