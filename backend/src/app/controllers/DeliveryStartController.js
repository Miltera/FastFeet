import { parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Package from '../models/Package';
import Recipient from '../models/Recipient';
import Courier from '../models/Courier';

class DeliveryStartController {
  async update(req, res) {
    const { courier_id, start_date } = req.body;
    const { id } = req.params;
    const courier = await Courier.findByPk(courier_id);

    if (!courier) {
      return res.status(400).json({ error: 'Courier not exists' });
    }

    const delivery = await Package.findOne({
      where: {
        id,
        deliveryman_id: courier_id,
        start_date: {
          [Op.is]: null,
        },
      },
    });

    if (!delivery) {
      return res.status(400).json({
        error:
          'This package not belongs to this courier or already is in route to delivery',
      });
    }

    await delivery.update({
      start_date: parseISO(start_date),
    });

    return res.json(delivery);
  }
}

export default new DeliveryStartController();
