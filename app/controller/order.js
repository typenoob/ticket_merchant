'use strict';

const { start } = require('egg');

const Controller = require('egg').Controller;

class OrderController extends Controller {
    async changeOrderToSuc() {
        const { id } = this.ctx.params;
        this.ctx.body = await this.ctx.model.Order.submit(id, 'success');
        this.ctx.status = 200;
    }
    async changeOrderToError() {
        const { id } = this.ctx.params;
        this.ctx.body = await this.ctx.model.Order.submit(id, 'error');
        this.ctx.status = 200;
    }
    async addOrder() {
        const { card, id, start, end } = this.ctx.request.body;
        this.ctx.body = await this.ctx.model.Order.addByCardAndTicket(card, id, start, end);
        this.ctx.status = 200;
    }
    async getOrder() {
        const { number, status } = this.ctx.query;
        this.ctx.body = await this.ctx.model.Order.getByCardAndStatus(number, status);
        this.ctx.status = 200;
    }
}

module.exports = OrderController;
