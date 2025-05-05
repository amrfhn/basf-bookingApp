const returning = true

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const transaction = await queryInterface.sequelize.transaction()
      const qsq = async (q) => {
        return (await queryInterface.sequelize.query(q, { transaction, returning }))[0]
      }

      /** * Ergonomic Amenity ***/
      const ergonomicAmenityId = (await qsq(`SELECT * FROM amenities WHERE en_name = 'ergonomic'`))[0].id

      /** * Electric Amenity ***/
      const electricAmenityId = (await qsq(`SELECT * FROM amenities WHERE en_name = 'electric'`))[0].id

      /** * Drop Ergonomic OBC03 ***/
      const seatsErgonomicAmenityIds = (
        await qsq(
          `SELECT id FROM "seatAmenities" WHERE "amenityId" = ${ergonomicAmenityId} AND "seatId" IN (SELECT s.id FROM seats s JOIN areas a ON s."areaId" = a.id JOIN floors f ON a."floorId" = f.id JOIN buildings b ON b.id = f."buildingId" WHERE b.name = 'OBC03');`
        )
      )
        .map((sa) => sa.id)
        .join(',')

      await qsq(`DELETE FROM "seatAmenityBooleanValues" WHERE "seatAmenityId" IN (${seatsErgonomicAmenityIds});`)
      await qsq(`DELETE FROM "seatAmenities" WHERE id IN (${seatsErgonomicAmenityIds});`)

      /** * Migrate Ergonomic to Electric OBC04 ***/
      await qsq(
        `UPDATE "seatAmenities" SET "amenityId" = ${electricAmenityId} WHERE "amenityId" = ${ergonomicAmenityId};`
      )

      await qsq(`DELETE FROM amenities WHERE id = ${ergonomicAmenityId};`)

      await transaction.commit()
    } catch (e) {
      console.error(e)
      throw e
    }
  },
  down: async (queryInterface, Sequelize) => {},
}
