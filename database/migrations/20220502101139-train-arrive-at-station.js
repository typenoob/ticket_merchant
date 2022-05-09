'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('train_arrive_at_station', {
      date: { type: Sequelize.DATEONLY, allowNull: false, primaryKey: true, defaultValue: Sequelize.literal('CURRENT_DATE') },
      train_number: { type: Sequelize.TEXT, allowNull: false, primaryKey: true },
      station_name: {
        type: Sequelize.TEXT, allowNull: false, primaryKey: true, onDelete: 'CASCADE',
        onUpdate: 'CASCADE', references: { model: 'stations', key: 'station_name' }
      },
      next_station: {
        type: Sequelize.TEXT, primaryKey: true, onDelete: 'CASCADE',
        onUpdate: 'CASCADE', references: { model: 'stations', key: 'station_name' }
      },
      arrive_time: { type: Sequelize.TIME },
      depart_time: { type: Sequelize.TIME },
    }).then(() => {
      return queryInterface.addConstraint('train_arrive_at_station', {
        type: 'FOREIGN KEY',
        name: 'FK_train',
        fields: ['train_number', 'date'],
        references: {
          table: 'trains',
          fields: ['train_number', 'date']
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('train_arrive_at_station');
  }
};