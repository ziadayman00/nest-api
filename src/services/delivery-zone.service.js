const { DeliveryZone } = require('../models');
const AppError = require('../utils/app-error');

const normalizeCity = (city) => city.trim().toLowerCase();
const validateDeliveryWindow = (data) => {
  if (data.estimatedDeliveryMinDays && data.estimatedDeliveryMaxDays && Number(data.estimatedDeliveryMinDays) > Number(data.estimatedDeliveryMaxDays)) {
    throw new AppError('Minimum delivery days cannot exceed maximum delivery days', 400);
  }
};
const createDeliveryZone = async (data) => {
  validateDeliveryWindow(data);
  const city = normalizeCity(data.city);
  if (await DeliveryZone.findOne({ where: { city } })) throw new AppError('A delivery zone already exists for this city', 409);
  return DeliveryZone.create({ ...data, city });
};
const listPublicDeliveryZones = () => DeliveryZone.findAll({
  where: { isActive: true },
  attributes: ['id', 'name', 'city', 'shippingFee', 'freeShippingThreshold', 'estimatedDeliveryMinDays', 'estimatedDeliveryMaxDays'],
  order: [['name', 'ASC']],
});
const listDeliveryZones = () => DeliveryZone.findAll({ order: [['createdAt', 'DESC']] });
const updateDeliveryZone = async (id, data) => {
  const zone = await DeliveryZone.findByPk(id);
  if (!zone) throw new AppError('Delivery zone not found', 404);
  const next = { ...data };
  if (next.city) {
    next.city = normalizeCity(next.city);
    const duplicate = await DeliveryZone.findOne({ where: { city: next.city } });
    if (duplicate && duplicate.id !== zone.id) throw new AppError('A delivery zone already exists for this city', 409);
  }
  validateDeliveryWindow({ estimatedDeliveryMinDays: next.estimatedDeliveryMinDays ?? zone.estimatedDeliveryMinDays, estimatedDeliveryMaxDays: next.estimatedDeliveryMaxDays ?? zone.estimatedDeliveryMaxDays });
  await zone.update(next);
  return zone;
};
const deactivateDeliveryZone = async (id) => {
  const zone = await DeliveryZone.findByPk(id);
  if (!zone) throw new AppError('Delivery zone not found', 404);
  await zone.update({ isActive: false });
};

module.exports = { createDeliveryZone, listPublicDeliveryZones, listDeliveryZones, updateDeliveryZone, deactivateDeliveryZone, normalizeCity };
