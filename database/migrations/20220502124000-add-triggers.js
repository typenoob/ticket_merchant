'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`CREATE TRIGGER release_ticket_trigger
        BEFORE INSERT OR UPDATE OF first_class_ticket, second_class_ticket, third_class_ticket
        ON public.trains
        FOR EACH ROW
        EXECUTE FUNCTION public.release_ticket();`)
    },

    async down(queryInterface, Sequelize) {
        queryInterface.dropTrigger('trains', 'release_ticket_trigger');
    }
};
