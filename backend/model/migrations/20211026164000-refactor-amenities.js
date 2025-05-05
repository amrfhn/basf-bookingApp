module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    await queryInterface.addColumn(
      'amenities',
      'key',
      {
        type: Sequelize.STRING,
      },
      { transaction }
    )

    await queryInterface.sequelize.query(`UPDATE amenities SET "key" = "en_name";`, { transaction })

    await queryInterface.sequelize.query(`ALTER TABLE amenities ALTER COLUMN "key" SET NOT NULL;`, { transaction })

    await queryInterface.removeColumn('amenities', 'en_name', { transaction })
    await queryInterface.removeColumn('amenities', 'es_name', { transaction })
    await queryInterface.removeColumn('amenities', 'de_name', { transaction })
    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    await queryInterface.addColumn(
      'amenities',
      'en_name',
      {
        type: Sequelize.STRING,
      },
      { transaction }
    )
    await queryInterface.addColumn(
      'amenities',
      'es_name',
      {
        type: Sequelize.STRING,
      },
      { transaction }
    )
    await queryInterface.addColumn(
      'amenities',
      'de_name',
      {
        type: Sequelize.STRING,
      },
      { transaction }
    )

    await queryInterface.sequelize.query(
      `UPDATE amenities SET "en_name" = "key";
       UPDATE amenities SET "es_name" = "key";
       UPDATE amenities SET "de_name" = "key";`,
      { transaction }
    )

    await queryInterface.sequelize.query(
      `ALTER TABLE amenities ALTER COLUMN "en_name" SET NOT NULL;
       ALTER TABLE amenities ALTER COLUMN "es_name" SET NOT NULL;
       ALTER TABLE amenities ALTER COLUMN "de_name" SET NOT NULL;`,
      { transaction }
    )

    await queryInterface.removeColumn('amenities', 'key', { transaction })

    await transaction.commit()
  },
}
