import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },

  image: {
    type: DataTypes.STRING,
    allowNull: false
  },

  images: {
    type: DataTypes.JSON,
    allowNull: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.JSON,
    allowNull: false
  },
  priceCents: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  offers: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  colorway: {
    type: DataTypes.STRING,
    allowNull: true
  },
  releaseDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sizes: {
    type: DataTypes.JSON,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  keywords: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return this.getDataValue('keywords').split(',');
    },
    set(val) {
      this.setDataValue('keywords', val.join(','));
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
