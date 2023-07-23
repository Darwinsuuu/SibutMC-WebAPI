'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('status_list', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status_desc: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        allowNull: false
      }
    });


    await queryInterface.bulkInsert('status_list', [
      {
        status_name: 'Pending',
        status_desc: 'Appointment is still pending.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status_name: 'Approved',
        status_desc: 'Appointment was approved.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status_name: 'Declined',
        status_desc: 'Appointment was declined.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status_name: 'Completed',
        status_desc: 'Appointment is completed',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('status_list');
  }
};