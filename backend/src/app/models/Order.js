import Sequelize, { Model } from 'sequelize';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        recipient_id: Sequelize.STRING,
        deliveryman_id: Sequelize.STRING,
        signature_id: Sequelize.STRING,
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        created_at: Sequelize.DATE,
        status: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
  }
}

export default Order;
