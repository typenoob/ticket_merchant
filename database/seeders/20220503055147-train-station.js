'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        const fs = require("fs");
        await queryInterface.bulkInsert('train_arrive_at_station', JSON.parse(fs.readFileSync("./database/seeders/schedule_common.json")));
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('train_arrive_at_station', null, {});
    }
};
