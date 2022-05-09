'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stations', {
      station_name: { type: Sequelize.TEXT, primaryKey: true },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stations');
  }
};