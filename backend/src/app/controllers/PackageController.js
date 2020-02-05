import * as Yup from 'yup';

import Package from '../models/Package';
import Recipient from '../models/Recipient';
import Courier from '../models/Courier';

class PackageController {
  async index(req, res) {
    const packages = await Package.findAll({
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

    return res.json(packages);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const recipientExists = await Recipient.findByPk(recipient_id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient not exists' });
    }

    const courierExists = await Courier.findByPk(deliveryman_id);

    if (!courierExists) {
      return res.status(400).json({ error: 'Courier not exists' });
    }

    const packages = await Package.create({
      recipient_id,
      deliveryman_id,
      product,
    });

    return res.json(packages);
  }

  async update(req, res) {
    //
  }

  async delete(req, res) {
    //
  }
}

export default new PackageController();
