import * as Yup from 'yup';

import Courier from '../models/Courier';

class CourierController {
  async index(req, res) {
    const courier = await Courier.findAll({
      attributes: ['id', 'name', 'avatar_id', 'email'],
    });
    return res.json(courier);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const courier = await Courier.create(req.body);

    return res.json(courier);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    let courier = await Courier.findByPk(req.params.id);

    if (!courier) {
      return res.status(400).json({ error: 'Courier not exists' });
    }

    courier = await courier.update(req.body);

    return res.json(courier);
  }

  async delete(req, res) {
    const courier = await Courier.findByPk(req.params.id);

    if (!courier) {
      return res.status(400).json({ error: 'Courier not exists' });
    }

    await courier.destroy();

    return res
      .status(200)
      .json({ sucess: 'The Courier is deleted successfully' });
  }
}

export default new CourierController();
