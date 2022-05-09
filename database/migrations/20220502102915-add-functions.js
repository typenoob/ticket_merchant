'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createFunction(
      'through_station',
      [
        { type: 'text', name: 'train_number_in', direction: 'IN' },
        { type: 'date', name: 'date_in', direction: 'IN' },
        { type: 'text[]', name: 'through_stations', direction: 'OUT' },
      ],
      'text[]',
      'plpgsql',
      `
      SELECT start_station
      from trains WHERE train_number=train_number_in
      AND date=date_in INTO _current_station;
      IF _current_station IS null THEN
        return;
       END IF;
      through_stations:=array_append(through_stations,_current_station);
      SELECT station_name,next_station FROM train_arrive_at_station
       WHERE date_in=train_arrive_at_station.date 
       AND train_number_in=train_arrive_at_station.train_number
       AND _current_station=train_arrive_at_station.station_name 
       INTO _current_station,_next_station;
       _current_station=_next_station;
      LOOP 
       through_stations:=array_append(through_stations,_current_station);
       SELECT station_name,next_station FROM train_arrive_at_station
       WHERE date_in=train_arrive_at_station.date 
       AND train_number_in=train_arrive_at_station.train_number
       AND _current_station=train_arrive_at_station.station_name 
       AND arrive_time is not null
       INTO _current_station,_next_station;
       EXIT WHEN _current_station=_next_station;
       
       _current_station=_next_station;
      END LOOP ;
   `,
      [
        'VOLATILE',
      ],
      {
        variables:
          [
            { type: 'text', name: '_current_station' },
            { type: 'text', name: '_next_station' }
          ],
        force: true
      },
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropFunction('through_station', [
      { type: 'text', name: 'train_number_in', direction: 'IN' },
      { type: 'date', name: 'date_in', direction: 'IN' },
      { type: 'text[]', name: 'through_stations', direction: 'OUT' },
    ]);
  }
};