import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import User from './User.js';
import Match from './Match.js';

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  matchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'match_id',
    references: {
      model: Match,
      key: 'id'
    }
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sender_id',
    references: {
      model: User,
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'read_at'
  }
}, {
  tableName: 'messages',
  underscored: true,
  timestamps: true
});

// İlişkileri tanımlayalım
Message.belongsTo(Match, { foreignKey: 'match_id' });
Message.belongsTo(User, { as: 'Sender', foreignKey: 'sender_id' });

export default Message; 