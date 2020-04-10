import { parseISO, getHours, subHours, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Signature from '../models/Signature';

/**
 * O que o Entregador pode fazer é:
 * GET - verificar encomendas vinculadas ao seu ID
 * PUT - fazer retiradas, apenas 5 no dia das 08:00 as 18:00
 *        automaticamente o campo start_date é preenchido
 * Criar Controller especifico para entregadores chamado: Delivery
 */

class DeliveryOrdersController {
  async index(req, res) {
    // const { page } = req.query;

    // const { id } = req.params;
    // const delivery = await Deliveryman.findByPk(id, {
    //   attributes: ['id', 'name', 'email', 'created_at'],
    //   include: [
    //     {
    //       model: File,
    //       as: 'avatar',
    //       attributes: ['id', 'path', 'url'],
    //     },
    //   ],
    // });

    // if (!delivery) {
    //   return res
    //     .status(401)
    //     .json({ error: 'Deliveryman is not a registration.' });
    // }

    // return res.json(delivery);
    const { id: deliverymanId } = req.params;

    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const deliveries = await Order.findAll({
      where: {
        deliveryman_id: deliverymanId,
        signature_id: null,
        canceled_at: null,
      },
      order: ['id'],
      attributes: [
        'id',
        'deliveryman_id',
        'product',
        'status',
        'start_date',
        'end_date',
        'canceled_at',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'state',
            'city',
            'street',
            'number',
            'complement',
            'zip_code',
          ],
        },
        {
          model: Signature,
          as: 'signature',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    /**
     * Verifica se o entregador está no prazo entre as 08:00 e s 18:00.
     */
    const { start_date } = req.body;

    // convert a data em apenas horas com o decrescimo de 3 horas subHours
    const parseDate = subHours(parseISO(start_date), 3);

    // convert a data em apenas horas com o acrescimo de 3 horas
    if (getHours(parseDate) + 3 <= '08' || getHours(parseDate) + 3 >= '18') {
      return res
        .status(400)
        .json({ error: 'Products can be picked up between 08:00 and 18:00.' });
    }

    /**
     * Verifica se o entregador já fez mais de 5 retiradas no dia
     */
    const countOrderDay = await Order.findAndCountAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
        canceled_at: null,
        deliveryman_id: req.params.id,
      },
    });

    if (countOrderDay.count >= 5) {
      return res
        .status(400)
        .json({ error: 'Only 5 retirees are allowed per delivery person.' });
    }

    /**
     * Busca ordens em aberto para entrega que não estejam canceladas
     */
    const { idOrder } = req.params;
    const orderExist = await Order.findByPk(idOrder, {
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        start_date: null,
      },
    });

    if (!orderExist) {
      return res
        .status(400)
        .json({ error: 'Order already exists for deliveryman.' });
    }

    const {
      deliveryman_id,
      recipient_id,
      signature_id,
      canceled_at,
    } = await orderExist.update(req.body);

    return res.json({
      deliveryman_id,
      recipient_id,
      start_date,
      signature_id,
      canceled_at,
    });
  }

  async show(req, res) {
    /**
     * Verifica se o signature_id ainda não foi preenchido
     */
    const { id, idOrder } = req.params;

    const orderSignatureNull = await Order.findByPk(idOrder, {
      where: {
        deliveryman_id: id,
        canceled_at: null,
        start_date: { [Op.ne]: null },
        signature_id: null,
      },
    });

    orderSignatureNull.update(req.body);

    /**
     * Verifica se o signature_id foi preenchido para atualizar o end_date
     */
    const orderSignature = await Order.findByPk(idOrder, {
      include: [
        {
          model: Signature,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
      where: {
        deliveryman_id: id,
        canceled_at: null,
        start_date: { [Op.ne]: null },
        signature_id: { [Op.ne]: null },
      },
    });

    if (orderSignature) {
      orderSignature.end_date = new Date();
      await orderSignature.save();
      // return res.json(orderSignature);
    }

    return res.json(orderSignature);
  }
}
export default new DeliveryOrdersController();
