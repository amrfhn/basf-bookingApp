module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addConstraint('amenities', {
      fields: ['type', 'key', 'siteId'],
      type: 'unique',
      name: 'amenity_unique_constraint',
    })
    await queryInterface.addConstraint('amenityValues', {
      fields: ['value', 'amenityId'],
      type: 'unique',
      name: 'amenityValue_unique_constraint',
    })
  },
  down: async (queryInterface) => {
    await queryInterface.removeConstraint('amenities', 'amenity_unique_constraint')
    await queryInterface.removeConstraint('amenityValues', 'amenityValue_unique_constraint')
  },
}
