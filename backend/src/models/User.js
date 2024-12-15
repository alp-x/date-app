import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../database/connection.js';

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 18,
      max: 100
    }
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  interested_in: {
    type: DataTypes.ENUM('male', 'female', 'both'),
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  photos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  education: {
    type: DataTypes.STRING,
    allowNull: true
  },
  job: {
    type: DataTypes.STRING,
    allowNull: true
  },
  interests: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  is_premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  last_active: {
    type: DataTypes.DATE,
    allowNull: true
  },
  settings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      theme: 'light',
      notifications: true,
      privacy: {
        showLocation: true,
        showAge: true,
        showEducation: true
      }
    }
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  },
  underscored: true,
  timestamps: true
});

User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default User; 