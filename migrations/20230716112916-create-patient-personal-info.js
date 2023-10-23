'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('patient_personal_infos', {
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
      firstname: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      middlename: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      lastname: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      marital_status: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      birthdate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      contact_no: {
        type: Sequelize.STRING(13),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      region: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      province: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      cityMun: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      barangay: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('patient_personal_infos');
  }
};