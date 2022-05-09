'use strict';

const Controller = require('egg').Controller;

class PassengerController extends Controller {
    async getPassenger() {
        const { id } = this.ctx.params;
        this.ctx.body = await this.ctx.model.Passenger.findByID(id);
        this.ctx.status = 200;
    }
    async getPassengerName() {
        const { id } = this.ctx.params;
        this.ctx.body = await this.ctx.model.Passenger.findNameByID(id);
        this.ctx.status = 200;
    }
    async getPassengerCard() {
        const { name, id } = this.ctx.query;
        this.ctx.body = await this.ctx.model.Passenger.findIDByName(name, id);
        this.ctx.status = 200;
    }
    async addPassenger() {
        const { phone, name, id } = this.ctx.request.body;
        const { number } = this.ctx.params;
        this.ctx.body = await this.ctx.model.Passenger.addByCardAndName(number, name, phone, id);
        this.ctx.status = 200;
    }

    async showPassenger() {
        const { page, limit } = this.ctx.query;
        this.ctx.body = await this.ctx.model.Passenger.findByPage(page, limit);
        this.ctx.status = 200;
    }
    async deletePassenger() {
        const { number } = this.ctx.params;
        this.ctx.body = await this.ctx.model.Passenger.deleteByID(number);
        this.ctx.status = 200;
    }
}

module.exports = PassengerController;
