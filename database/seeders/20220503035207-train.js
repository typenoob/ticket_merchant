'use strict';

const { jsonp } = require("../../config/plugin");

module.exports = {
  async up(queryInterface, Sequelize) {
    const fs = require("fs");
    await queryInterface.bulkInsert('trains', JSON.parse(fs.readFileSync("./database/seeders/train_common.json")));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tickets', null, {});
    await queryInterface.bulkDelete('trains', null, {});
  }
};
