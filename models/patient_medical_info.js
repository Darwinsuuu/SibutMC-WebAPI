'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class patient_medical_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  patient_medical_info.init({
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    disability: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contagious_disease: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    blood_pressure: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blood_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'patient_medical_info',
  });
  return patient_medical_info;
};