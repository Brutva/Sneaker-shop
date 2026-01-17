import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const Offer = sequelize.define('Offer', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  storeId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Stores',
      key: 'id'
    }
  },
  priceCents: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deliveryMinDays: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  deliveryMaxDays: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'New'
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  sizes: {
    type: DataTypes.JSON,
    allowNull: true
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
