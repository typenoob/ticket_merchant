'use strict';

const ticket = require('../model/ticket');

const Controller = require('egg').Controller;

class TicketController extends Controller {
    async getTicket() {
        const { level, date } = this.ctx.query;
        this.ctx.body = await this.ctx.model.Train.findByNumber(level, date, this.ctx.params.number);
        this.ctx.status = 200;
    }
    async modifyTicket() {
        this.ctx.body = await this.ctx.model.Train.modifyByInc(this.ctx.request.body);
        this.ctx.status = 200;
    }
    async getTicketByID() {
        const { id } = this.ctx.params;
        this.ctx.body = await this.ctx.model.Ticket.findByID(id);
        this.ctx.status = 200;
    }
    async showTicket() {
        const { page, limit, level, date } = this.ctx.query;
        this.ctx.body = await this.ctx.model.Train.findByPage(page, limit, level, date);
        this.ctx.status = 200;
    }
    async getAnyTicket() {
        const { number, date, level } = this.ctx.query;
        console.log(number, date, ticket);
        this.ctx.body = await this.ctx.model.Ticket.findAny(number, date, level);
        this.ctx.status = 200;
    }
    async TicketSold() {
        const { start, end, id } = this.ctx.params;
        this.ctx.body = await this.ctx.model.Ticket.sold(start, end, id);
        this.ctx.status = 200;
    }
    async TicketRefund() {
        const { id } = this.ctx.params;
        this.ctx.body = await this.ctx.model.Ticket.refund(id);
        this.ctx.status = 200;
    }
    async getPrice() {
        const { level } = this.ctx.query;
        const { start, end } = this.ctx.params;
        this.ctx.body = await this.ctx.model.Ticket.computePrice(start, end, level);
        this.ctx.status = 200;
    }

}

module.exports = TicketController;
