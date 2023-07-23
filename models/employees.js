'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class employees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  employees.init({
    staff_firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    staff_lastname:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    staff_position:{
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'employees',
  });
  return employees;
};