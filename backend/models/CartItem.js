import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const CartItem = sequelize.define('CartItem', {
  offerId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Offers',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deliveryOptionId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'DeliveryOptions',
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE(3)
  },
  updatedAt: {
    type: DataTypes.DATE(3)
  },
}, {
  defaultScope: {
    order: [['createdAt', 'ASC']]
  }
});
