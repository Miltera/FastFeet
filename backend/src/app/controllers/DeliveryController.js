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
      attributes: ['id', 'product'],
      include: [
        {
          model: Recipient,
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
}

export default new DeliveryController();
