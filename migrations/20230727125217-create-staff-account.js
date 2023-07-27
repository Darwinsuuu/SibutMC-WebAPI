'use strict';
const bcryptjs = require('bcryptjs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staff_accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.INTEGER
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


    bcryptjs.genSalt(10, function (err, salt) {
      bcryptjs.hash('staff_password', salt, async function (err, hash) {
        await queryInterface.bulkInsert('staff_accounts', [
          {
            username: 'staff_account',
            password: hash,
            type: 2,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]);
      })
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('staff_accounts');
  }
};