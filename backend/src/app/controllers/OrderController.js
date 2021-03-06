/* eslint-disable prettier/prettier */
import * as Yup from 'yup';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';

import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Notification from '../schemas/Notification';

import DeliveryOrderMail from '../jobs/DeliveryOrderMail';
import Queue from '../../lib/Queue';

class OrderController {
  async index(req, res) {
    // paginação
    const { page = 1, nameProductLike } = req.query;

    const order = nameProductLike
      ? await Order.findAll({
        attributes: [
          'id',
          'product',
          'status',
          'canceled_at',
          'start_date',
          'end_date',
        ],
        limit: 8,
        offset: (page - 1) * 8,
        include: [
          {
            model: Recipient,
            as: 'recipient',
            paranoid: false,
            attributes: [
              'id',
              'name',
              'street',
              'number',
              'complement',
              'city',
              'state',
              'zip_code',
            ],
          },
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email', 'avatar_id'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['id', 'path', 'url'],
              },
            ],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['id', 'path', 'url'],
          },
        ],
        where: {
          product: {
            [Op.iLike]: `%${nameProductLike}%`,
          },
        },
        order: [['created_at', 'DESC']],
      })
      : await Order.findAll({
        attributes: [
          'id',
          'product',
          'status',
          'canceled_at',
          'start_date',
          'end_date',
        ],
        limit: 8,
        offset: (page - 1) * 8,
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: [
              'id',
              'name',
              'street',
              'number',
              'complement',
              'city',
              'state',
              'zip_code',
            ],
          },
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email', 'avatar_id'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['id', 'path', 'url'],
              },
            ],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['id', 'path', 'url'],
          },
        ],
        order: [['created_at', 'DESC']],
      });

    return res.json(order);
  }

  async show(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      attributes: ['id', 'product', 'recipient_id', 'deliveryman_id'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    return res.json(order);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.string().required(),
      deliveryman_id: Yup.string().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { recipient_id, deliveryman_id } = req.body;
    // Verifica se o recipientId está cadastrado na tabela recipients

    let recipient = null;

    if (recipient_id) {
      recipient = await Recipient.findByPk(recipient_id);

      if (!recipient) {
        return res.status(400).json({ error: 'Recipient does not exists.' });
      }
    }

    // Verifica se o deliverymanId está cadastrado na tabela deliveryman
    let deliverymanExists = null;

    if (deliveryman_id) {
      deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

      if (!deliverymanExists) {
        return res.status(400).json({ error: 'Deliveryman not exists.' });
      }
    }

    const { product } = req.body;

    const {
      id,
      signature_id,
      start_date,
      end_date,
      canceled_at,
    } = await Order.create({
      product,
      recipient_id,
      deliveryman_id,
      status: 'PENDENTE',
    });

    /**
     * Notificar deliveryman
     */
    const delivery = await Deliveryman.findByPk(deliveryman_id);
    const orderDate = await Order.findByPk(id);

    // const parseDate = subHours(parseISO(orderDate.created_at), 3);
    const parseDate = orderDate.created_at;

    const formattedDate = format(
      parseDate,
      "'dia' dd 'de' MMMM 'de' yyyy', às' H:mm'h.'",
      { locale: pt }
    );

    /**
     * Envio de email
     */
    const addressRecipient = `${recipient.street}, ${recipient.number},
                              ${recipient.zip_code}, ${recipient.complement},
                              ${recipient.city}-${recipient.state}`;

    // chamada queue de filas
    await Queue.add(DeliveryOrderMail.key, {
      delivery,
      orderDate,
      formattedDate,
      recipient,
      addressRecipient,
    });

    await Notification.create({
      content: `Novo agendamento para o ${delivery.name} no ${formattedDate}`,
      deliveryman: deliveryman_id,
      status: 'PENDENTE',
    });

    return res.json({
      id,
      product,
      recipient_id,
      deliveryman_id,
      signature_id,
      start_date,
      end_date,
      canceled_at,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.string().required(),
      deliveryman_id: Yup.string().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    const { id } = req.params;

    const orderExists = await Order.findOne({ where: { id } });

    if (!orderExists) {
      return res.status(400).json({ error: 'Order already not exists.' });
    }

    // Verifica se o recipientId está cadastrado na tabela recipients
    const { recipient_id, deliveryman_id } = req.body;

    let recipient = null;

    if (recipient_id) {
      recipient = await Recipient.findByPk(recipient_id);

      if (!recipient) {
        return res.status(400).json({ error: 'Recipient not exists.' });
      }
    }

    // Verifica se o deliverymanId está cadastrado na tabela deliveryman
    let deliveryman = null;

    if (deliveryman_id) {
      deliveryman = await Deliveryman.findByPk(deliveryman_id);

      if (!deliveryman) {
        return res.status(400).json({ error: 'Deliveryman not exists.' });
      }
    }

    const orderId = await Order.findByPk(id);

    const { product } = await orderId.update(req.body);

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const orderExist = await Order.findByPk(id);

    if (!orderExist) {
      return res.status(400).json({ error: 'Order not exists for delete.' });
    }

    const order = await Order.findByPk(id, {
      attributes: ['id', 'recipient_id', 'deliveryman_id', 'product'],
    });

    await order.destroy();

    return res.json(order);
  }
}

export default new OrderController();
