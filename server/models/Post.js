const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./User');

const Post = db.define('Post', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '无标题'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON, // Stores array of image URLs
    defaultValue: []
  },
  tags: {
    type: DataTypes.JSON, // For AI tags later
    defaultValue: []
  }
}, {
  timestamps: true
});

// Setup association
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

module.exports = Post;
