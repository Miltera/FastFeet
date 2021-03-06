import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Package from '../models/Package';
import Recipient from '../models/Recipient';
import Courier from '../models/Courier';

class DeliveryStartController {
  async update(req, res) {
    const { deliveryman_id, start_date } = req.body;
    const { id } = req.params;
    let courier = await Courier.findByPk(deliveryman_id);

    if (!courier) {
      return res.status(400).json({ error: 'Courier not exists' });
    }

    const delivery = await Package.findByPk(id, {
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
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!delivery) {
      return res.status(400).json({
        error: 'This package not exists',
      });
    }

    if (delivery.courier.id !== courier.id) {
      return res.status(400).json({
        error: 'This package not belongs to this courier',
      });
    }

    if (delivery.start_date != null) {
      return res.status(400).json({
        error: 'This package already is in route to delivery',
      });
    }

    const numberDelivery = await Package.count({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [
            startOfDay(parseISO(start_date)),
            endOfDay(parseISO(start_date)),
          ],
        },
      },
    });

    if (numberDelivery == 5) {
      return res.status(400).json({
        error:
          'The courier has already reached the maximum number of daily deliveries',
      });
    }

    await delivery.update({
      start_date: parseISO(start_date),
    });

    return res.json(delivery);
  }
}

export default new DeliveryStartController();
