const { start } = require("egg");
const ticket = require("./ticket");

module.exports = app => {
  // 字段数据类型
  const { UUID, CHAR, DATE, TEXT } = app.Sequelize;

  // model定义
  const Order = app.model.define('orders', {
    ticket_id: {
      type: UUID, allowNull: false, onDelete: 'CASCADE',
      onUpdate: 'CASCADE', references: { model: { tableName: 'tickets' }, key: 'ticket_id' }
    },
    card_number: {
      type: CHAR(18), allowNull: false, onDelete: 'CASCADE',
      onUpdate: 'CASCADE', references: { model: { tableName: 'passengers' }, key: 'card_number' }
    },
    order_id: { type: UUID, primaryKey: true, defaultValue: app.model.literal('uuid_generate_v1()') },
    status: { type: TEXT, allowNull: false, defaultValue: 'block' },
    start_station: { type: TEXT },
    end_station: { type: TEXT },
    pay_method: { type: TEXT },
    created_at: { type: DATE, defaultValue: app.model.fn('now') },
  }, { timestamps: false });
  Order.addByCardAndTicket = async function (number, id, start, end) {
    console.log(start, end);
    return await this.create({ card_number: number, ticket_id: id, start_station: start, end_station: end }).then(() => '添加成功').catch(error => { console.log(error); return '添加失败'; });
  }
  Order.submit = async function (id, status) {
    //app.model.query(`UPDATE tickets SET is_sold = true FROM tickets,trains WHERE tickets.ticket_id = orders.ticket_id and orders.order_id='${id}'`).catch(error => { console.log(error); return '更新失败'; });
    return await this.update({ status: status }, { where: { order_id: id } }).then(() => '改变成功').catch(error => { console.log(error); return '改变失败'; });
  }
  Order.getByCardAndStatus = async function (number, status) {
    return await this.findAll({ attributes: ['ticket_id', 'order_id', 'created_at', 'start_station', 'end_station'], where: { card_number: number, status: status } }).catch(error => { console.log(error); return '查询失败'; });
  }



  return Order;
};