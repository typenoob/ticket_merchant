'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createFunction(
            'get_distance',
            [
                { type: 'numeric', name: 'lon1', direction: 'IN' },
                { type: 'numeric', name: 'lat1', direction: 'IN' },
                { type: 'numeric', name: 'lon2', direction: 'IN' },
                { type: 'numeric', name: 'lat2', direction: 'IN' },
            ],
            'integer',
            'plpgsql',
            `
            --地球半径
            v_earth_radius:=6378137;
             
            radLat1 := lat1 * pi()/180.0;
            radLat2 := lat2 * pi()/180.0;
            v_radlatdiff := radLat1 - radLat2;
            v_radlngdiff := lon1 * pi()/180.0 - lon2 * pi()/180.0; 
            v_distance := 2 * asin(sqrt(power(sin(v_radlatdiff / 2), 2) + cos(radLat1) * cos(radLat2) * power(sin(v_radlngdiff/2),2)));
            v_distance := round(v_distance * v_earth_radius);
            return v_distance; 
   `,
            [
                'VOLATILE',
            ],
            {
                variables:
                    [
                        {
                            type: `numeric`, name: 'v_distance'
                        },
                        {
                            type: `numeric`, name: 'v_earth_radius'
                        },
                        {
                            type: `numeric`, name: 'radLat1'
                        }, {
                            type: `numeric`, name: 'radLat2'
                        }, {
                            type: `numeric`, name: 'v_radlatdiff'
                        }, {
                            type: `numeric`, name: 'v_radlngdiff'
                        },
                    ],
                force: true
            },
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropFunction('get_distance', [
            { type: 'numeric', name: 'lon1', direction: 'IN' },
            { type: 'numeric', name: 'lat1', direction: 'IN' },
            { type: 'numeric', name: 'lon2', direction: 'IN' },
            { type: 'numeric', name: 'lat2', direction: 'IN' },
        ]);
    }
};