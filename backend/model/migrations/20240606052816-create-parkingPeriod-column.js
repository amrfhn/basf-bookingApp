'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    await queryInterface.addColumn (
      'buildings',
      'parkingReservationDays',
      {
        type: Sequelize.INTEGER,
      },
      { transaction }
    )

    await queryInterface.sequelize.query(`UPDATE buildings SET "parkingReservationDays" = 5`, { transaction })

    await queryInterface.sequelize.query(`ALTER TABLE buildings ALTER COLUMN "parkingReservationDays" SET NOT NULL`, { transaction })

    await transaction.commit()
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
