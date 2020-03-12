import * as Yup from 'yup';

import { parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Package from '../models/Package';
import Recipient from '../models/Recipient';
import Courier from '../models/Courier';
import File from '../models/File';

class DeliveryFinishController {
  async update(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      end_date: Yup.date().required(),
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { deliveryman_id, end_date, signature_id } = req.body;
    const { id } = req.params;
    let courier = await Courier.findByPk(deliveryman_id);

    if (!courier) {
      return res.status(400).json({ error: 'Courier not exists' });
    }

    const delivery = await Package.findOne({
      where: {
        id,
        start_date: { [Op.not]: null },
      },
      attributes: ['id', 'product', 'end_date'],
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
        error: 'The package does not exist or was not picked up by the courier',
      });
    }

    if (delivery.courier.id !== courier.id) {
      return res.status(400).json({
        error: 'This package not belongs to this courier',
      });
    }

    if (delivery.end_date != null) {
      return res.status(400).json({
        error: 'The package has already been delivered',
      });
    }

    const signatureImage = await File.findByPk(signature_id);

    if (!signatureImage) {
      return res.status(400).json({ error: 'Signature image does not exists' });
    }

    await delivery.update({
      signature_id,
      end_date: parseISO(end_date),
    });

    return res.json(delivery);
  }
}

export default new DeliveryFinishController();
