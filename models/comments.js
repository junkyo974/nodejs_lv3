'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
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
  comments.init({
    commentId: {
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
    comment: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return comments;
};