'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class appointments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  appointments.init({
    user_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    appointed_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    appointed_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    status:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    decline_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'appointment_records',
  });
  return appointments;
};