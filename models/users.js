'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasMany(models.Posts, { 
        sourceKey: 'userId', 
        foreignKey: 'UserId', 
      });

      
      this.hasMany(models.Comments, { 
        sourceKey: 'userId', 
        foreignKey: 'UserId', 
      });      

      
      this.hasMany(models.Likes, { 
        sourceKey: 'userId', 
        foreignKey: 'UserId', 
      });
      
    }
  }
  Users.init({
    userId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    nickname: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("now")
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("now")
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};