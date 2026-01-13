import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const Favorite = sequelize.define('Favorite', {
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    references: {
      model: 'Products',
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
