import * as Yup from 'yup';

import Package from '../models/Package';
import Recipient from '../models/Recipient';
import Courier from '../models/Courier';

import Queue from '../../lib/Queue';
import DeliveryMail from '../jobs/DeliveryMail';

class PackageController {
  async index(req, res) {
    const packages = await Package.findAll({
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

    const completeDelivery = await Package.findByPk(packages.id, {
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
          attributes: ['name', 'email'],
        },
      ],
    });

    await Queue.add(DeliveryMail.key, { completeDelivery });

    return res.json(completeDelivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    const { id } = req.params;
    const { recipient_id, deliveryman_id } = req.body;

    const packages = await Package.findByPk(id, {
      attributes: ['id', 'product'],
      include: [
        {
          model: Courier,
          attributes: ['name', 'email'],
        },
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
      ],
    });

    if (!packages) {
      return res.status(400).json({ message: 'Package not found!' });
    }

    if (recipient_id) {
      const recipient = await Recipient.findByPk(recipient_id);

      if (!recipient) {
        return res.status(400).json({ message: 'Recipient not found!' });
      }
    }

    if (deliveryman_id) {
      const deliveryman = await Courier.findByPk(deliveryman_id);

      if (!deliveryman) {
        return res.status(400).json({ message: 'Deliveryman not found!' });
      }
    }

    await packages.update(req.body);

    return res.json({ packages });
  }

  async delete(req, res) {
    console.log(req.params.id);
    const packages = await Package.findByPk(req.params.id);

    if (!packages) {
      return res.status(400).json({ error: 'Package not exists' });
    }

    await packages.destroy();

    return res
      .status(200)
      .json({ sucess: 'The package is deleted successfully' });
  }
}

export default new PackageController();
