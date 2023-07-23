'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medical_records', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      appointment_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      medical_reason: {
        type: Sequelize.STRING,
        allowNull: false
      },
      medical_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      diagnosis: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      physician: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('medical_records');
  }
};