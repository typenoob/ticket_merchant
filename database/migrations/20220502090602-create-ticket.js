'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tickets', {
      ticket_id: { type: Sequelize.UUID, allowNull: false, primaryKey: true, defaultValue: Sequelize.literal('uuid_generate_v1()') },
      start_station: { type: Sequelize.TEXT, allowNull: false },
      end_station: { type: Sequelize.TEXT, allowNull: false },
      class: { type: Sequelize.INTEGER, allowNull: false },
      is_sold: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      date: { type: Sequelize.DATEONLY, allowNull: false, default: Sequelize.literal('CURRENT_DATE') },
      train_number: { type: Sequelize.TEXT, allowNull: false },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tickets');
  }
};