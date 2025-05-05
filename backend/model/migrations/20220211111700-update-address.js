module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('alter table buildings alter column address type character varying(120);')
  },
  down: async () => {},
}
