'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('passengers', {
      card_number: { type: Sequelize.CHAR(18), primaryKey: true },
      name: { type: Sequelize.TEXT },
      phone: { type: Sequelize.CHAR(11) },
      user_id: { type: Sequelize.TEXT, allowNull: false, },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('passengers');
  }
};