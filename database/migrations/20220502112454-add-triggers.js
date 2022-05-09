'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.sequelize.query(`CREATE TRIGGER divide_ticket_trigger
    BEFORE UPDATE 
    ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.divide_ticket();`);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTrigger('tickets', 'divide_ticket_trigger');
  }
};
