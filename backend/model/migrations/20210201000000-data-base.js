const insertBookingStatuses = `INSERT INTO "bookingStatuses" (id, status, "createdAt", "updatedAt") 
     VALUES (1, 'Available', current_date, current_date), 
            (2, 'Booked', current_date, current_date),
            (3, 'Reserved', current_date, current_date);
     ALTER SEQUENCE "bookingStatuses_id_seq" RESTART WITH 4;`

const insertAmenities = `INSERT INTO "amenities" (en_name, es_name, de_name, type, "createdAt", "updatedAt") 
     VALUES ('monitors', 'monitores', 'monitore','NUMERIC', current_date, current_date), 
            ('ergonomic', 'ergonómico', 'ergonomisch','BOOLEAN', current_date, current_date), 
            ('manual adjustable', 'ajustable manualmente', 'manuell einstellbar','BOOLEAN', current_date, current_date), 
            ('not adjustable', 'no ajustable', 'nicht einstellbar','BOOLEAN', current_date, current_date);`

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(insertBookingStatuses)
    await queryInterface.sequelize.query(insertAmenities)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('bookingStatuses', null, {})
    await queryInterface.bulkDelete('amenities', null, {})
  },
}
