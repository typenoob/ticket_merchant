'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('stations', 'lon', { type: Sequelize.DECIMAL(10, 5), allowNull: false });
    queryInterface.addColumn('stations', 'lat', { type: Sequelize.DECIMAL(10, 5), allowNull: false });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('stations', 'lon');
    queryInterface.removeColumn('stations', 'lat');
  }
};
