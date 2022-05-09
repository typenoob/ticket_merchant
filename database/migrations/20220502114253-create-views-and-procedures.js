'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.sequelize.query(`-- PROCEDURE: public.purchase_ticket(text, text, uuid)

    -- DROP PROCEDURE IF EXISTS public.purchase_ticket(text, text, uuid);
    
    CREATE OR REPLACE PROCEDURE public.purchase_ticket(
      IN _start_station text,
      IN _end_station text,
      IN _ticket_id uuid)
    LANGUAGE 'plpgsql'
    AS $BODY$
        DECLARE 
        _status text;
        counter INTEGER := 60 ; 
        divider INTEGER := 0 ;
        BEGIN
        -- 并发购票锁
        BEGIN
        LOOP
          LOCK TABLE tickets IN ROW EXCLUSIVE MODE;
          PERFORM * from tickets where ticket_id=_ticket_id FOR UPDATE;
          UPDATE tickets SET start_station=_start_station,end_station=_end_station
          ,is_sold=true WHERE ticket_id=_ticket_id;
          SELECT status FROM orders WHERE ticket_id=_ticket_id AND status!='error'
          into _status;
          raise notice '%',_status;
          EXIT WHEN _status='success';
          PERFORM pg_sleep(1);
          counter:=counter-1;
          divider:=divider/counter;
        END LOOP ; 
        EXCEPTION 
          WHEN division_by_zero THEN
            UPDATE orders SET status='error' WHERE ticket_id=_ticket_id;
        END;
        END
        
    $BODY$;
    ALTER PROCEDURE public.purchase_ticket(text, text, uuid)
        OWNER TO postgres;
    
    
    `);
    queryInterface.sequelize.query(`
    CREATE OR REPLACE PROCEDURE public.add_through_stations(
      IN through_stations json,
      IN _date date,
      IN _train_number text)
    LANGUAGE 'plpgsql'
    AS $BODY$
    DECLARE
        i json;
        last_station text;
        _arrive time without time zone;
        _depart time without time zone;
    BEGIN
      FOR i IN SELECT * FROM json_array_elements(through_stations)
      LOOP
        IF (last_station is not null) THEN
            insert into train_arrive_at_station 
            values(_date,_train_number,last_station,i->>'station_name'
                  ,_arrive,_depart);
        END IF;
        last_station:=i->>'station_name';
        _arrive:=i->>'arrive_time';
        _depart:=i->>'depart_time';
      END LOOP;
      insert into train_arrive_at_station 
            values(_date,_train_number,last_station,last_station
                  ,_arrive,_depart);
    END
    $BODY$;
    ALTER PROCEDURE public.add_through_stations(json, date, text)
        OWNER TO postgres;
    
    `);


  },

  async down(queryInterface, Sequelize) {
    queryInterface.sequelize.query(`
    DROP PROCEDURE purchase_ticket;
    `);
    queryInterface.sequelize.query(`
    DROP PROCEDURE add_through_stations;
    `);
  }
};
