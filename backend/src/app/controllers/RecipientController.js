import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('Name is required'),
      address: Yup.string().required(),
      number: Yup.number().required(),
      addressLine: Yup.string().notRequired(),
      state: Yup.string()
        .min(2)
        .max(2)
        .required(),
      city: Yup.string().required(),
      zipCode: Yup.string()
        .min(8)
        .max(8)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('Name is required'),
      address: Yup.string().required(),
      number: Yup.number().required(),
      addressLine: Yup.string().notRequired(),
      state: Yup.string()
        .min(2)
        .max(2)
        .required(),
      city: Yup.string().required(),
      zipCode: Yup.string()
        .min(8)
        .max(8)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    let recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not exists' });
    }

    recipient = await recipient.update(req.body);

    return res.json(recipient);
  }

  async index(req, res) {
    const recipient = await Recipient.findAll({
      attributes: [
        'id',
        'name',
        'address',
        'number',
        'addressLine',
        'state',
        'city',
        'zipCode',
      ],
    });
    return res.json(recipient);
  }
}

export default new RecipientController();
