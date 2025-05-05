module.exports = {
  up: async (queryInterface, Sequelize) => {
    // CASCADE IN AMENITIES
    await queryInterface.removeConstraint('amenities', 'siteid')
    await queryInterface.addConstraint('amenities', {
      type: 'foreign key',
      fields: ['siteId'],
      name: 'siteid',
      references: { table: 'sites', field: 'id' },
      onDelete: 'cascade',
    })
    await queryInterface.removeConstraint('amenityValues', 'amenityValues_amenityId_fkey')
    await queryInterface.addConstraint('amenityValues', {
      type: 'foreign key',
      fields: ['amenityId'],
      name: 'amenityValues_amenityId_fkey',
      references: { table: 'amenities', field: 'id' },
      onDelete: 'cascade',
    })
    await queryInterface.removeConstraint('seatAmenityMultiValues', 'seatAmenityMultiValues_amenityValueId_fkey')
    await queryInterface.addConstraint('seatAmenityMultiValues', {
      type: 'foreign key',
      fields: ['amenityValueId'],
      name: 'seatAmenityMultiValues_amenityValueId_fkey',
      references: { table: 'amenityValues', field: 'id' },
      onDelete: 'cascade',
    })
    await queryInterface.removeConstraint('seatAmenities', 'seatAmenities_amenityId_fkey')
    await queryInterface.addConstraint('seatAmenities', {
      type: 'foreign key',
      fields: ['amenityId'],
      name: 'seatAmenities_amenityId_fkey',
      references: { table: 'amenities', field: 'id' },
      onDelete: 'cascade',
    })
    await queryInterface.removeConstraint('seatAmenityMultiValues', 'seatAmenityMultiValues_seatAmenityId_fkey')
    await queryInterface.addConstraint('seatAmenityMultiValues', {
      type: 'foreign key',
      fields: ['seatAmenityId'],
      name: 'seatAmenityMultiValues_seatAmenityId_fkey',
      references: { table: 'seatAmenities', field: 'id' },
      onDelete: 'cascade',
    })
    await queryInterface.removeConstraint('seatAmenityBooleanValues', 'seatAmenityBooleanValues_seatAmenityId_fkey')
    await queryInterface.addConstraint('seatAmenityBooleanValues', {
      type: 'foreign key',
      fields: ['seatAmenityId'],
      name: 'seatAmenityBooleanValues_seatAmenityId_fkey',
      references: { table: 'seatAmenities', field: 'id' },
      onDelete: 'cascade',
    })
    await queryInterface.removeConstraint('seatAmenityNumericValues', 'seatAmenityNumericValues_seatAmenityId_fkey')
    await queryInterface.addConstraint('seatAmenityNumericValues', {
      type: 'foreign key',
      fields: ['seatAmenityId'],
      name: 'seatAmenityNumericValues_seatAmenityId_fkey',
      references: { table: 'seatAmenities', field: 'id' },
      onDelete: 'cascade',
    })

    // CASCADE IN BUILDINGS
    await queryInterface.removeConstraint('buildings', 'buildings_siteId_fkey')
    await queryInterface.addConstraint('buildings', {
      type: 'foreign key',
      fields: ['siteId'],
      name: 'buildings_siteId_fkey',
      references: { table: 'sites', field: 'id' },
      onDelete: 'cascade',
    })

    // CASCADE IN BRIGADIERS
    await queryInterface.removeConstraint('brigadiers', 'brigadiers_siteId_fkey')
    await queryInterface.addConstraint('brigadiers', {
      type: 'foreign key',
      fields: ['siteId'],
      name: 'brigadiers_siteId_fkey',
      references: { table: 'sites', field: 'id' },
      onDelete: 'cascade',
    })

    // CASCADE IN HOODS
    await queryInterface.removeConstraint('hoods', 'siteid')
    await queryInterface.addConstraint('hoods', {
      type: 'foreign key',
      fields: ['siteId'],
      name: 'siteid',
      references: { table: 'sites', field: 'id' },
      onDelete: 'cascade',
    })
    await queryInterface.removeConstraint('hoodOrgCodes', 'hoodOrgCodes_hoodId_fkey')
    await queryInterface.addConstraint('hoodOrgCodes', {
      type: 'foreign key',
      fields: ['hoodId'],
      name: 'hoodOrgCodes_hoodId_fkey',
      references: { table: 'hoods', field: 'id' },
      onDelete: 'cascade',
    })
    await queryInterface.removeConstraint('seatHoods', 'seatHoods_hoodId_fkey')
    await queryInterface.addConstraint('seatHoods', {
      type: 'foreign key',
      fields: ['hoodId'],
      name: 'seatHoods_hoodId_fkey',
      references: { table: 'hoods', field: 'id' },
      onDelete: 'cascade',
    })

    // CASCADE IN WORKSTREAMS
    await queryInterface.removeConstraint('workStreams', 'workStreams_siteId_fkey')
    await queryInterface.addConstraint('workStreams', {
      type: 'foreign key',
      fields: ['siteId'],
      name: 'workStreams_siteId_fkey',
      references: { table: 'sites', field: 'id' },
      onDelete: 'cascade',
    })
    await queryInterface.removeConstraint('workStreamOrgCodes', 'workStreamOrgCodes_workStreamId_fkey')
    await queryInterface.addConstraint('workStreamOrgCodes', {
      type: 'foreign key',
      fields: ['workStreamId'],
      name: 'workStreamOrgCodes_workStreamId_fkey',
      references: { table: 'workStreams', field: 'id' },
      onDelete: 'cascade',
    })
  },

  down: async (queryInterface, Sequelize) => {
    // CASCADE IN AMENITIES
    await queryInterface.removeConstraint('amenities', 'siteid')
    await queryInterface.addConstraint('amenities', {
      type: 'foreign key',
      fields: ['siteId'],
      name: 'siteid',
      references: { table: 'sites', field: 'id' },
    })
    await queryInterface.removeConstraint('amenityValues', 'amenityValues_amenityId_fkey')
    await queryInterface.addConstraint('amenityValues', {
      type: 'foreign key',
      fields: ['amenityId'],
      name: 'amenityValues_amenityId_fkey',
      references: { table: 'amenities', field: 'id' },
    })
    await queryInterface.removeConstraint('seatAmenityMultiValues', 'seatAmenityMultiValues_amenityValueId_fkey')
    await queryInterface.addConstraint('seatAmenityMultiValues', {
      type: 'foreign key',
      fields: ['amenityValueId'],
      name: 'seatAmenityMultiValues_amenityValueId_fkey',
      references: { table: 'amenityValues', field: 'id' },
    })
    await queryInterface.removeConstraint('seatAmenities', 'seatAmenities_amenityId_fkey')
    await queryInterface.addConstraint('seatAmenities', {
      type: 'foreign key',
      fields: ['amenityId'],
      name: 'seatAmenities_amenityId_fkey',
      references: { table: 'amenities', field: 'id' },
    })
    await queryInterface.removeConstraint('seatAmenityMultiValues', 'seatAmenityMultiValues_seatAmenityId_fkey')
    await queryInterface.addConstraint('seatAmenityMultiValues', {
      type: 'foreign key',
      fields: ['seatAmenityId'],
      name: 'seatAmenityMultiValues_seatAmenityId_fkey',
      references: { table: 'seatAmenities', field: 'id' },
    })
    await queryInterface.removeConstraint('seatAmenityBooleanValues', 'seatAmenityBooleanValues_seatAmenityId_fkey')
    await queryInterface.addConstraint('seatAmenityBooleanValues', {
      type: 'foreign key',
      fields: ['seatAmenityId'],
      name: 'seatAmenityBooleanValues_seatAmenityId_fkey',
      references: { table: 'seatAmenities', field: 'id' },
    })
    await queryInterface.removeConstraint('seatAmenityNumericValues', 'seatAmenityNumericValues_seatAmenityId_fkey')
    await queryInterface.addConstraint('seatAmenityNumericValues', {
      type: 'foreign key',
      fields: ['seatAmenityId'],
      name: 'seatAmenityNumericValues_seatAmenityId_fkey',
      references: { table: 'seatAmenities', field: 'id' },
    })

    // CASCADE IN BUILDINGS
    await queryInterface.removeConstraint('buildings', 'buildings_siteId_fkey')
    await queryInterface.addConstraint('buildings', {
      type: 'foreign key',
      fields: ['siteId'],
      name: 'buildings_siteId_fkey',
      references: { table: 'sites', field: 'id' },
    })

    // CASCADE IN BRIGADIERS
    await queryInterface.removeConstraint('brigadiers', 'brigadiers_siteId_fkey')
    await queryInterface.addConstraint('brigadiers', {
      type: 'foreign key',
      fields: ['siteId'],
      name: 'brigadiers_siteId_fkey',
      references: { table: 'sites', field: 'id' },
    })

    // CASCADE IN HOODS
    await queryInterface.removeConstraint('hoods', 'siteid')
    await queryInterface.addConstraint('hoods', {
      type: 'foreign key',
      fields: ['siteId'],
      name: 'siteid',
      references: { table: 'sites', field: 'id' },
    })
    await queryInterface.removeConstraint('hoodOrgCodes', 'hoodOrgCodes_hoodId_fkey')
    await queryInterface.addConstraint('hoodOrgCodes', {
      type: 'foreign key',
      fields: ['hoodId'],
      name: 'hoodOrgCodes_hoodId_fkey',
      references: { table: 'hoods', field: 'id' },
    })
    await queryInterface.removeConstraint('seatHoods', 'seatHoods_hoodId_fkey')
    await queryInterface.addConstraint('seatHoods', {
      type: 'foreign key',
      fields: ['hoodId'],
      name: 'seatHoods_hoodId_fkey',
      references: { table: 'hoods', field: 'id' },
    })

    // CASCADE IN WORKSTREAMS
    await queryInterface.removeConstraint('workStreams', 'workStreams_siteId_fkey')
    await queryInterface.addConstraint('workStreams', {
      type: 'foreign key',
      fields: ['siteId'],
      name: 'workStreams_siteId_fkey',
      references: { table: 'sites', field: 'id' },
    })
    await queryInterface.removeConstraint('workStreamOrgCodes', 'workStreamOrgCodes_workStreamId_fkey')
    await queryInterface.addConstraint('workStreamOrgCodes', {
      type: 'foreign key',
      fields: ['workStreamId'],
      name: 'workStreamOrgCodes_workStreamId_fkey',
      references: { table: 'workStreams', field: 'id' },
    })
  },
}
