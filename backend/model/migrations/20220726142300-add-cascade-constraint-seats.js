module.exports = {
  up: async (queryInterface, Sequelize) => {
    // CASCADE IN SEATHOODS
    await queryInterface.removeConstraint('seatHoods', 'seatHoods_seatId_fkey')
    await queryInterface.addConstraint('seatHoods', {
      type: 'foreign key',
      fields: ['seatId'],
      name: 'seatHoods_seatId_fkey',
      references: { table: 'seats', field: 'id' },
      onDelete: 'cascade',
    })

    // CASCADE IN SEATOWNERS
    await queryInterface.removeConstraint('seatOwners', 'seatOwners_seatId_fkey')
    await queryInterface.addConstraint('seatOwners', {
      type: 'foreign key',
      fields: ['seatId'],
      name: 'seatOwners_seatId_fkey',
      references: { table: 'seats', field: 'id' },
      onDelete: 'cascade',
    })

    // CASCADE IN BOOKINGS
    await queryInterface.removeConstraint('bookings', 'bookings_seatId_fkey')
    await queryInterface.addConstraint('bookings', {
      type: 'foreign key',
      fields: ['seatId'],
      name: 'bookings_seatId_fkey',
      references: { table: 'seats', field: 'id' },
      onDelete: 'cascade',
    })

    // CASCADE IN SEATAMENITIES
    await queryInterface.removeConstraint('seatAmenities', 'seatAmenities_seatId_fkey')
    await queryInterface.addConstraint('seatAmenities', {
      type: 'foreign key',
      fields: ['seatId'],
      name: 'seatAmenities_seatId_fkey',
      references: { table: 'seats', field: 'id' },
      onDelete: 'cascade',
    })
  },
  down: async (queryInterface, Sequelize) => {
    // CASCADE IN SEATHOODS
    await queryInterface.removeConstraint('seatHoods', 'seatHoods_seatId_fkey')
    await queryInterface.addConstraint('seatHoods', {
      type: 'foreign key',
      fields: ['seatId'],
      name: 'seatHoods_seatId_fkey',
      references: { table: 'seats', field: 'id' },
    })

    // CASCADE IN SEATOWNERS
    await queryInterface.removeConstraint('seatOwners', 'seatOwners_seatId_fkey')
    await queryInterface.addConstraint('seatOwners', {
      type: 'foreign key',
      fields: ['seatId'],
      name: 'seatOwners_seatId_fkey',
      references: { table: 'seats', field: 'id' },
    })

    // CASCADE IN BOOKINGS
    await queryInterface.removeConstraint('bookings', 'bookings_seatId_fkey')
    await queryInterface.addConstraint('bookings', {
      type: 'foreign key',
      fields: ['seatId'],
      name: 'bookings_seatId_fkey',
      references: { table: 'seats', field: 'id' },
    })

    // CASCADE IN SEATAMENITIES
    await queryInterface.removeConstraint('seatAmenities', 'seatAmenities_seatId_fkey')
    await queryInterface.addConstraint('seatAmenities', {
      type: 'foreign key',
      fields: ['seatId'],
      name: 'seatAmenities_seatId_fkey',
      references: { table: 'seats', field: 'id' },
    })
  },
}
