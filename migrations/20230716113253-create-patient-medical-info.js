'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('patient_medical_infos', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      disability: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      contagious_disease: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      height: {
        type: Sequelize.FLOAT(2,2),
        allowNull: false,
      },
      weight: {
        type: Sequelize.FLOAT(2,2),
        allowNull: false,
      },
      blood_pressure: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      blood_type: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('patient_medical_infos');
  }
};