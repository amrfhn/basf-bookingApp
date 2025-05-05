module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    await queryInterface.createTable(
      'seatPreferables',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        seatId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'seats', key: 'id' },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        transaction,
      }
    )

    // await queryInterface.sequelize.query(`drop view "seatCascade";`)

    await queryInterface.changeColumn(
      'floors',
      'number',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
      {
        transaction,
      }
    )
    await transaction.commit()

    await queryInterface.sequelize.query(
      `create view public."seatCascade" as 
      select ss.id as "seatId",s.name as site, b.name as building, f.number as floor, a.code as area, ss.code as seat
      from sites s
         inner join buildings b on b."siteId" = s.id
         inner join floors f on f."buildingId" = b.id
         inner join areas a on a."floorId" = f.id
         inner join seats ss on ss."areaId" = a.id;`
    )

    await queryInterface.addConstraint('seatPreferables', {
      fields: ['userId', 'seatId'],
      type: 'unique',
      name: 'seatPreferable',
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('seatPreferables')
  },
}
