const {
  Amenity,
  config,
  AmenityValue,
  Seat,
  SeatAmenity,
  SeatAmenityNumericValue,
  SeatAmenityBooleanValue,
  SeatAmenityMultiValue,
} = require('../model')
const Amenities = require('../entities/Amenity')
const { sequelize, Op, raw, nest } = config

module.exports = {
  getAll(filter) {
    console.log('GetAll Amenities')
    const where = {}
    if (filter) {
      where[Op.and] = []

      if (filter.siteId) {
        where.siteId = filter.siteId
      }
      if (filter.key) {
        where.key = filter.key
      }
    }

    const include = [{ model: AmenityValue, attributes: ['id', 'amenityId', 'value'] }]
    const attributes = ['id', 'type', 'filterable', 'key', 'siteId']

    const order = sequelize.col('key')
    return Amenity.findAll({ attributes, where, include, order })
  },
  async bulkCreate(data) {
    console.log('BulkCreate amenity', data)
    const transaction = await Amenity.sequelize.transaction()
    await Amenity.bulkCreate(data, {
      fields: ['type', 'key', 'siteId'],
      ignoreDuplicates: true,
    })
    const dataAmenityValue = []
    for (const a of data || []) {
      const dataValues = {}
      dataValues.amenityId = (
        await Amenity.findOne({ where: { type: a.type, key: a.key, siteId: a.siteId } })
      ).toJSON().id
      dataValues.value = a.amenityValues[0].value
      dataAmenityValue.push(dataValues)
    }
    await AmenityValue.bulkCreate(dataAmenityValue, {
      fields: ['value', 'amenityId'],
      ignoreDuplicates: true,
    })
    await transaction.commit()
  },

  get(id) {
    console.log('Get amenity', id)
    const include = [{ model: AmenityValue, attributes: ['id', 'amenityId', 'value'] }]
    const attributes = ['id', 'type', 'filterable', 'key', 'siteId']
    return Amenity.findByPk(id, { include, attributes })
  },
  async create(data) {
    console.log('Create amenity', data)
    const include = [{ model: AmenityValue, attributes: ['id', 'amenityId', 'value'] }]
    const attributes = ['id', 'type', 'filterable', 'key', 'siteId']

    const transaction = await Amenity.sequelize.transaction()
    const created = (await Amenity.create(data, { transaction })).toJSON()
    for (const amenityValues of data.amenityValues || []) {
      await AmenityValue.create({ ...amenityValues, amenityId: created.id }, { transaction })
    }

    const result = await Amenity.findByPk(created.id, { include, attributes, transaction })
    await transaction.commit()
    return result
  },
  async update(id, data) {
    console.log('Update amenity', id, data)
    const transaction = await Amenity.sequelize.transaction()
    const include = [{ model: AmenityValue, attributes: ['id', 'amenityId', 'value'] }]
    const attributes = ['id', 'type', 'filterable', 'key', 'siteId']

    const db = await Amenity.findByPk(id, { include, attributes, transaction })

    const dicc = {}

    for (const av of db.amenityValues || []) {
      dicc[av.value] = true
    }

    for (const av of data.amenityValues || []) {
      if (dicc[av.value]) {
        delete dicc[av.value]
      } else {
        dicc[av.value] = false
      }
    }

    for (const value in dicc) {
      if (dicc[value]) {
        await AmenityValue.destroy({ where: { amenityId: id, value }, transaction })
      } else {
        await AmenityValue.create({ value, amenityId: id }, { transaction })
      }
    }

    await Amenity.update(data, { where: { id } })
    const result = await Amenity.findByPk(id, { include, attributes, transaction })
    await transaction.commit()

    return result
  },
  async delete(id) {
    console.log('Delete amenity', id)
    const transaction = await Amenity.sequelize.transaction()
    const include = [{ model: AmenityValue, attributes: ['id', 'amenityId', 'value'] }]
    const attributes = ['id', 'type', 'filterable', 'key', 'siteId']

    const elem = await Amenity.findByPk(id, { include, attributes, transaction })
    await AmenityValue.destroy({ where: { amenityId: id }, transaction })
    await Amenity.destroy({ where: { id: id }, transaction })
    await transaction.commit()

    return elem
  },

  async deleteSeatAmenities(seatId) {
    console.log('Delete seat amenities', seatId)
    const where = {}
    const seatAmenities = await SeatAmenity.findAll({ where: { seatId }, raw })
    const ids = seatAmenities.map((sa) => sa.id)
    where.id = { [Op.in]: ids }
    return SeatAmenity.destroy({ raw, nest, where })
  },

  async massive(data) {
    console.log('Massive amenity', data)
    const transaction = await Amenity.sequelize.transaction()
    const attributes = ['id', 'type', 'filterable', 'key', 'siteId']

    try {
      for (const item of data) {
        for (const value of item.values) {
          const seatAmenity = await SeatAmenity.findOne({
            where: { seatId: item.seatId, amenityId: value.amenityId },
            attributes: ['id', 'seatId', 'amenityId'],
            include: [
              { model: Amenity, attributes: ['id', 'key', 'type'] },
              { model: SeatAmenityNumericValue, attributes: ['value'] },
              { model: SeatAmenityBooleanValue, attributes: ['value'] },
              { model: SeatAmenityMultiValue, include: [{ model: AmenityValue, attributes: ['value'] }] },
            ],
            transaction,
          })

          // Case: seatAmenity is in DB
          if (seatAmenity) {
            // but new value is null or undefined
            if (!value.value) {
              // must delete value
              await SeatAmenityNumericValue.destroy({ where: { seatAmenityId: seatAmenity.id }, transaction })
              await SeatAmenityBooleanValue.destroy({ where: { seatAmenityId: seatAmenity.id }, transaction })
              await SeatAmenityMultiValue.destroy({ where: { seatAmenityId: seatAmenity.id }, transaction })
              await seatAmenity.destroy({ transaction })
            } else {
              // but new value differs form db Value
              switch (seatAmenity.amenity.type) {
                case 'NUMERIC':
                  if (value.value !== seatAmenity.seatAmenityNumericValue.value) {
                    console.log(seatAmenity.id, ')', seatAmenity.seatAmenityNumericValue.value, '->', value.value)
                    await SeatAmenityNumericValue.update(
                      { value: value.value },
                      { where: { seatAmenityId: seatAmenity.id }, transaction }
                    )
                  }
                  break
                case 'BOOLEAN':
                  if (value.value !== seatAmenity.seatAmenityBooleanValue.value) {
                    console.log(seatAmenity.id, ')', seatAmenity.seatAmenityBooleanValue.value, '->', value.value)
                    await SeatAmenityBooleanValue.update(
                      { value: value.value },
                      { where: { seatAmenityId: seatAmenity.id }, transaction }
                    )
                  }
                  break
                case 'MULTI':
                  if (value.value !== seatAmenity.seatAmenityMultiValue.amenityValue.value) {
                    const txt = `${seatAmenity.id}) ${seatAmenity.seatAmenityMultiValue.amenityValue.value} -> ${value.value}`
                    console.log(txt)
                    const amenityValue = await AmenityValue.findOne({
                      where: { amenityId: seatAmenity.amenity.id, value: value.value },
                      transaction,
                    })
                    await SeatAmenityMultiValue.update(
                      { amenityValueId: amenityValue.id },
                      { where: { seatAmenityId: seatAmenity.id }, transaction }
                    )
                  }
                  break
                default:
                  console.log('Value not correct')
                  break
              }
            }
          } else {
            // Case: seatAmenity is NOT in DB
            if (value.value) {
              const amenity = await Amenity.findByPk(value.amenityId, { attributes, transaction })
              const seatAmenityNew = await SeatAmenity.create(
                { seatId: item.seatId, amenityId: value.amenityId },
                { transaction }
              )

              switch (amenity.type) {
                case 'NUMERIC':
                  await SeatAmenityNumericValue.create(
                    { seatAmenityId: seatAmenityNew.id, value: value.value },
                    { transaction }
                  )
                  break
                case 'BOOLEAN':
                  await SeatAmenityBooleanValue.create(
                    { seatAmenityId: seatAmenityNew.id, value: value.value },
                    { transaction }
                  )
                  break
                case 'MULTI':
                  {
                    const amenityValue = await AmenityValue.findOne({
                      where: { amenityId: value.amenityId, value: value.value },
                      transaction,
                    })
                    await SeatAmenityMultiValue.create(
                      { seatAmenityId: seatAmenityNew.id, amenityValueId: amenityValue.id },
                      { transaction }
                    )
                  }
                  break
                default:
                  console.log('Type not correct')
                  break
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e)
      await transaction.rollback()
    }

    await transaction.commit()
  },
}
