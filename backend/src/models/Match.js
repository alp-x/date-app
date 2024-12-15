import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import User from './User.js';

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id_1',
    references: {
      model: User,
      key: 'id'
    }
  },
  userId2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id_2',
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'matched', 'rejected'),
    defaultValue: 'pending'
  },
  matchedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'matched_at'
  }
}, {
  tableName: 'matches',
  underscored: true,
  timestamps: true
});

// İlişkileri tanımlayalım
Match.belongsTo(User, { as: 'User1', foreignKey: 'user_id_1' });
Match.belongsTo(User, { as: 'User2', foreignKey: 'user_id_2' });

export default Match; 