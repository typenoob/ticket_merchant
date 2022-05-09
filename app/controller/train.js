'use strict';

const Controller = require('egg').Controller;

class TrainController extends Controller {
    async getThroughStation() {
        const { date } = this.ctx.query;
        const { number } = this.ctx.params;
        this.ctx.body = await this.ctx.model.Train.getThroughStation(number, date);
        this.ctx.status = 200;
    }
    async searchTrain() {
        const { date } = this.ctx.query;
        const { text } = this.ctx.params;
        this.ctx.body = await this.ctx.model.Train.searchByStation(text, date);
        console.log(this.ctx.body);
        this.ctx.status = 200;
    }
    async addTrain() {
        this.ctx.body = await this.ctx.model.Train.addTrain(this.ctx.params.number, this.ctx.request.body);
        console.log(this.ctx.body);
        this.ctx.status = 200;
    }

    async showTrain() {
        const { page, limit, date } = this.ctx.query;
        this.ctx.body = await this.ctx.model.Train.findTrainByPage(page, limit, date);
        this.ctx.status = 200;
    }
    async deleteTrain() {
        const { date } = this.ctx.query;
        if (await this.ctx.model.Train.deleteTrain(this.ctx.params.number, date)) { this.ctx.body = "删除成功"; this.ctx.status = 200; }
        else this.ctx.body = "删除失败";

    }
    async getTrainArriveTime() {
        console.log(1);
        const { date } = this.ctx.query;
        const { name, number } = this.ctx.params;
        this.ctx.body = await this.ctx.model.Station.findTime(number, date, name);
        this.ctx.status = 200;
    }
    async searchTrainBetween() {
        const { date } = this.ctx.query;
        const { start, end } = this.ctx.params;
        this.ctx.body = await this.ctx.model.Train.findByCities(start, end, date);
    }
    async migrate() {
        const { date } = this.ctx.query;
        this.ctx.body = await this.ctx.model.Train.migrateAll(date);
    }
}

module.exports = TrainController;
