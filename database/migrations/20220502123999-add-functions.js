'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createFunction(
            'release_ticket',
            [
            ],
            'trigger',
            'plpgsql',
            `
    DELETE FROM tickets WHERE NEW.date=tickets.date
    AND NEW.train_number=tickets.train_number;
    SELECT NEW.first_class_ticket INTO counter;
    LOOP
        EXIT WHEN counter=0;
        INSERT INTO tickets (start_station,end_station,class,date,train_number)
        values (NEW.start_station,NEW.end_station,1,NEW.date,NEW.train_number);
        counter:=counter-1;
    END LOOP;
    SELECT NEW.second_class_ticket INTO counter;
    LOOP
        EXIT WHEN counter=0;
        INSERT INTO tickets (start_station,end_station,class,date,train_number)
        values (NEW.start_station,NEW.end_station,2,NEW.date,NEW.train_number);
        counter:=counter-1;
    END LOOP;
    SELECT NEW.third_class_ticket INTO counter;
    LOOP
        EXIT WHEN counter=0;
        INSERT INTO tickets (start_station,end_station,class,date,train_number)
        values (NEW.start_station,NEW.end_station,3,NEW.date,NEW.train_number);
        counter:=counter-1;
    END LOOP;
    RETURN NEW;
   `,
            [
                'VOLATILE',
            ],
            {
                variables:
                    [
                        { type: 'integer', name: 'counter' },
                    ],
                force: true
            },
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropFunction('release_ticket', []);
    }
};
