'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createFunction(
      'get_train_number_by_cities',
      [
        { type: 'text', name: 'depart_city', direction: 'IN' },
        { type: 'text', name: 'destinate_city', direction: 'IN' },
        { type: 'date', name: '_date', direction: 'IN' },
      ],
      'text[]',
      'plpgsql',
      `
      OPEN cur_depart_station;
      LOOP
        FETCH cur_depart_station INTO depart_station;
        EXIT WHEN NOT FOUND;
        OPEN cur_destinate_station;
        LOOP
          FETCH cur_destinate_station INTO destinate_station;
          EXIT WHEN NOT FOUND;
          SELECT train_number FROM trains
          WHERE depart_station=ANY(through_station(train_number,_date))
          AND destinate_station=ANY(through_station(train_number,_date))
          AND array_position(through_station(train_number,_date),depart_station)
          <array_position(through_station(train_number,_date),destinate_station)
          INTO _train_number;
          IF (_train_number IS NOT null)
          AND (NOT (_train_number=ANY(train_numbers))) THEN 
          train_numbers=array_append(train_numbers,_train_number);
          END IF;
        END LOOP;
        CLOSE cur_destinate_station;
      END LOOP;
      CLOSE cur_depart_station;
      return train_numbers;
   `,
      [
        'VOLATILE',
      ],
      {
        variables:
          [
            {
              type: `CURSOR FOR SELECT station_name 
              FROM stations WHERE depart_city%station_name`, name: 'cur_depart_station'
            },
            {
              type: `CURSOR FOR SELECT station_name
              FROM stations WHERE destinate_city%station_name`, name: 'cur_destinate_station'
            },
            { type: 'text', name: 'depart_station' },
            { type: 'text', name: 'destinate_station' },
            { type: 'text[]', name: 'train_numbers', default: "'{}'", },
            { type: 'text', name: '_train_number' },
          ],
        force: true
      },
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropFunction('get_train_number_by_cities', [
      { type: 'text', name: 'depart_city', direction: 'IN' },
      { type: 'text', name: 'destinate_city', direction: 'IN' },
      { type: 'date', name: '_date', direction: 'IN' },
    ]);
  }
};