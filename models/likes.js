'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      this.belongsTo(models.Users, { 
        targetKey: 'userId', 
        foreignKey: 'UserId', 
      });

      
      this.belongsTo(models.Posts, { 
        targetKey: 'postId', 
        foreignKey: 'PostId', 
      });
    }
  }
  likes.init({
    likesId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    UserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      
    },
    PostId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    
    },
  }, {
    sequelize,
    modelName: 'Likes',
  });
  return likes;
};