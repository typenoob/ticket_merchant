'use strict';

const Controller = require('egg').Controller;

class StationController extends Controller {
    async getStation() {
        console.log('getStation');
        this.ctx.body = await this.ctx.model.Station.findLikeText(this.ctx.params.text);
        this.ctx.status = 200;
    }
    async addStation() {
        this.ctx.body = await this.ctx.model.Station.createByBody(this.ctx.request.body);
        this.ctx.status = 200;
    }

    async showStation() {
        const { page, limit } = this.ctx.query;
        this.ctx.body = await this.ctx.model.Station.findByPage(page, limit);
        this.ctx.status = 200;
    }
    async deleteStation() {
        if (await this.ctx.model.Station.deleteByName(this.ctx.params.name)) { this.ctx.body = "删除成功"; this.ctx.status = 200; }
        else this.ctx.body = "删除失败";

    }
    async getExactName() {
        const { city } = this.ctx.params;
        const { number, date } = this.ctx.query;
        this.ctx.body = await this.ctx.model.Train.findExactStationName(city, number, date);
        this.ctx.status = 200;
    }
}

module.exports = StationController;
