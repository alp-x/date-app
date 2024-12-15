import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import User from './User.js';

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'TRY'
  },
  paymentMethod: {
    type: DataTypes.ENUM('apple_pay', 'google_pay'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  transactionId: {
    type: DataTypes.STRING,
    unique: true
  },
  subscriptionEndDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

// İlişkileri tanımlayalım
Payment.belongsTo(User, { foreignKey: 'userId' });

export default Payment; 