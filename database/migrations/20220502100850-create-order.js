'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      ticket_id: {
        type: Sequelize.UUID, allowNull: false, onDelete: 'CASCADE',
        onUpdate: 'CASCADE', references: { model: { tableName: 'tickets' }, key: 'ticket_id' }
      },
      card_number: {
        type: Sequelize.CHAR(18), allowNull: false, onDelete: 'CASCADE',
        onUpdate: 'CASCADE', references: { model: { tableName: 'passengers' }, key: 'card_number' }
      },
      order_id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.literal('uuid_generate_v1()') },
      status: { type: Sequelize.TEXT, allowNull: false, defaultValue: 'block' },
      pay_method: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
      start_station: { type: Sequelize.TEXT },
      end_station: { type: Sequelize.TEXT },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};