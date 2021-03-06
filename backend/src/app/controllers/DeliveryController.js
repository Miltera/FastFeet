import { Op } from 'sequelize';

import Package from '../models/Package';
import Recipient from '../models/Recipient';
import Courier from '../models/Courier';

class DeliveryController {
  async index(req, res) {
    const { id } = req.query;
    const courier = await Courier.findByPk(id);

    if (!courier) {
      return res.status(400).json({ error: 'Courier not exists' });
    }

    const delivery = await Package.findAll({
      where: {
        deliveryman_id: id,
        end_date: {
          [Op.is]: null,
        },
        canceled_at: {
          [Op.is]: null,
        },
      },
      attributes: ['id', 'product', 'start_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'address',
            'number',
            'addressLine',
            'state',
            'city',
            'zipCode',
          ],
        },
        {
          model: Courier,
          as: 'courier',
          attributes: ['name', 'avatar_id', 'email'],
        },
      ],
    });

    if (!delivery.length > 0) {
      return res
        .status(400)
        .json({ error: 'This courier has no pending delivery' });
    }

    res.json(delivery);
  }

  async show(req, res) {
    const { id } = req.params;
    const courier = await Courier.findByPk(id);

    if (!courier) {
      return res.status(400).json({ error: 'Courier not exists' });
    }

    const delivery = await Package.findAll({
      where: {
        deliveryman_id: id,
        end_date: {
          [Op.not]: null,
        },
      },
      attributes: ['id', 'product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'address',
            'number',
            'addressLine',
            'state',
            'city',
            'zipCode',
          ],
        },
        {
          model: Courier,
          as: 'courier',
          attributes: ['name', 'avatar_id', 'email'],
        },
      ],
    });

    if (!delivery.length > 0) {
      return res
        .status(400)
        .json({ error: 'This courier has no one finish deliveries' });
    }

    res.json(delivery);
  }
}

export default new DeliveryController();
