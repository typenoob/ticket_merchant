'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable('trains', {
      date: { type: Sequelize.DATEONLY, primaryKey: true, defaultValue: Sequelize.literal('CURRENT_DATE') },
      train_number: { type: Sequelize.TEXT, primaryKey: true },
      start_station: {
        type: Sequelize.TEXT, allowNull: false, onDelete: 'CASCADE',
        onUpdate: 'CASCADE', references: { model: 'stations', key: 'station_name' }
      },
      end_station: {
        type: Sequelize.TEXT, allowNull: false, onDelete: 'CASCADE',
        onUpdate: 'CASCADE', references: { model: 'stations', key: 'station_name' }
      },
      first_class_ticket: {
        type: Sequelize.INTEGER, allowNull: false, defaultValue: Sequelize.literal('ceil(30*RANDOM())'), validate: {
          min: 0
        }
      },
      second_class_ticket: {
        type: Sequelize.INTEGER, allowNull: false, defaultValue: Sequelize.literal('ceil(30*RANDOM())'), validate: {
          min: 0
        }
      },
      third_class_ticket: {
        type: Sequelize.INTEGER, allowNull: false, defaultValue: Sequelize.literal('ceil(30*RANDOM())'), validate: {
          min: 0
        }
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable('trains');
  }
};
