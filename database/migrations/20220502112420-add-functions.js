'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createFunction(
      'divide_ticket',
      [
      ],
      'trigger',
      'plpgsql',
      `
      if NEW.is_sold=true then
      if NEW.start_station!=OLD.start_station then
          insert into tickets  
          (start_station,end_station
          ,class,is_sold,date,train_number) 
          values 
          (OLD.start_station,NEW.start_station,
           NEW.class,false,
           NEW.date,NEW.train_number);
      end if;
     if NEW.end_station!=OLD.end_station then
          insert into tickets
          (start_station,end_station
          ,class,is_sold,date,train_number) 
          values
          (NEW.end_station,OLD.end_station,
           NEW.class,false,
           NEW.date,NEW.train_number);
      end if;
      else
      SELECT ticket_id,start_station FROM tickets WHERE NEW.train_number=train_number
      AND NEW.date=date and OLD.start_station=end_station limit 1 into _start,_start_station;
      if _start_station is not null THEN NEW.start_station=_start_station;
      DELETE FROM tickets WHERE ticket_id=_start;
      end if;
      SELECT ticket_id,end_station FROM tickets WHERE NEW.train_number=train_number
      AND NEW.date=date and OLD.end_station=start_station limit 1 into _end,_end_station;
       if _end_station is not null THEN NEW.end_station=_end_station;
       DELETE FROM tickets WHERE ticket_id=_end;
       end if;
    end if;
    return NEW;
   `,
      [
        'VOLATILE',
      ],
      {
        variables:
          [
            { type: 'text', name: '_start_station', },
            { type: 'text', name: '_end_station', },
            { type: 'uuid', name: '_start', },
            { type: 'uuid', name: '_end', },
          ],
        force: true
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropFunction('divide_ticket', []);
  }
};
