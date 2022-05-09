'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`create extension pg_trgm;
    CREATE INDEX ON stations USING gist (station_name gist_trgm_ops);
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`DROP INDEX stations_station_name_idx;
    drop extension pg_trgm;
    DROP EXTENSION "uuid-ossp";
    `);
    }
};