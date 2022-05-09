module.exports = app => {
    const { INTEGER, TEXT, DATEONLY, QueryTypes, QueryIn } = app.Sequelize;
    const Train = app.model.define('train', {
        date: { type: DATEONLY, primaryKey: true, defaultValue: app.model.literal('CURRENT_DATE') },
        train_number: { type: TEXT, primaryKey: true },
        start_station: {
            type: TEXT, allowNull: false, onDelete: 'CASCADE',
            onUpdate: 'CASCADE', references: { model: 'stations', key: 'station_name' }
        },
        end_station: {
            type: TEXT, allowNull: false, onDelete: 'CASCADE',
            onUpdate: 'CASCADE', references: { model: 'stations', key: 'station_name' }
        },
        first_class_ticket: { type: INTEGER, allowNull: false, defaultValue: app.model.literal('ceil(30*RANDOM())') },
        second_class_ticket: { type: INTEGER, allowNull: false, defaultValue: app.model.literal('ceil(30*RANDOM())') },
        third_class_ticket: { type: INTEGER, allowNull: false, defaultValue: app.model.literal('ceil(30*RANDOM())') },
    }, { timestamps: false });
    Train.associate = () => {
        Train.hasMany(app.model.Ticket, { foreignKey: 'train_number', sourceKey: 'train_number' }, { foreignKey: 'date', sourceKey: 'date' });
    }

    Train.findByPage = async function (page, limit, level, date) {
        return await this.findAll({
            limit: limit, offset: (page - 1) * limit, subQuery: false,
            attributes: ['train_number', 'start_station', 'end_station', 'date', [app.model.fn("COUNT", app.model.col("tickets.ticket_id")), "ticket_number"]],
            where: { date: date },
            include: {
                as: "tickets",
                model: app.model.Ticket, where: {
                    is_sold: false,
                    class: level,
                }, attributes: [
                ],
            }, group: ["train.train_number", "train.date"],
        }).
            catch(error => {
                console.log(error);
                return '查询失败';
            })
    }
    Train.findByNumber = async function (level, date, number) {
        return await this.findAll({
            subQuery: false,
            attributes: ['train_number', 'start_station', 'end_station', 'date', [app.model.fn("COUNT", app.model.col("tickets.ticket_id")), "ticket_number"]],
            where: { date: date, train_number: number },
            include: {
                as: "tickets",
                model: app.model.Ticket, where: {
                    is_sold: false,
                    class: level,
                }, attributes: [
                ],
            }, group: ["train.train_number", "train.date"],
        }).
            catch(error => {
                console.log(error);
                return '查询失败';
            })
    }
    Train.modifyByInc = async function (body) {
        const { level, date, number, inc } = body;
        const train = await this.findOne({ where: { date: date, train_number: number } });
        switch (Number(level)) {
            case 1: return await train.increment({ first_class_ticket: Number(inc) }).then(() => { return '修改成功' }).
                catch(error => {
                    console.log(2);
                    return '修改失败';
                });
            case 2: return await train.increment({ second_class_ticket: Number(inc) }).then(() => { return '修改成功' }).
                catch(error => {
                    console.log(2);
                    return '修改失败';
                });
            case 3: return await train.increment({ third_class_ticket: Number(inc) }).then(() => { return '修改成功' }).
                catch(error => {
                    console.log(2);
                    return '修改失败';
                });
        }

    }
    Train.findTrainByPage = async function (page, limit, date) {
        return await this.findAll({
            limit: limit, offset: (page - 1) * limit,
            attributes: ['train_number', 'start_station', 'end_station', 'first_class_ticket', 'second_class_ticket', 'third_class_ticket'],
            where: { date: date },
        }).
            catch(error => {
                console.log(error);
                return '查询失败';
            })
    }
    Train.findExactStationName = async function (city, number, date) {
        return await app.model.query(`select station_name from train_arrive_at_station where train_number='${number}' and date='${date}'
        and station_name like '${city}%'`, { type: QueryTypes.SELECT }).
            catch(error => {
                console.log(error);
                return '查询失败';
            })
    }
    Train.getThroughStation = async function (number, date) {
        return await app.model.query(`SELECT through_station('${number}',date '${date}');`, { type: QueryTypes.SELECT }).then(result => { return result[0].through_station; }).
            catch(error => {
                console.log(error);
                return '查询失败';
            });
    }
    Train.addTrain = async function (number, body) {
        const { through_stations, date } = body;
        console.log(date);
        return await this.create({ train_number: number, date: date, start_station: through_stations[0]['station_name'], end_station: through_stations[through_stations.length - 1]['station_name'], }).then(async () => { return await app.model.query(`CALL add_through_stations('${JSON.stringify(through_stations)}',date '${date}','${number}')`).spread; }).
            catch(error => {
                this.destroy({ where: { train_number: number, date: date } });
                if (error.parent.code == '23505')
                    return '已存在相同列车';
                console.log(error);
            })
    }
    Train.deleteTrain = async function (number, date) {
        return await this.destroy({ where: { train_number: number, date: date } }).catch(error => {
            console.log(error);
            return '删除失败';
        });
    }
    Train.searchByStation = async function (text, date) {
        list = [];
        result = await app.model.query(`select * from stations where station_name % '${text}'`, { type: QueryTypes.SELECT }).then(function (result) {
            result.forEach(item => list.push(item.station_name));
        });
        result = await app.model.query(`select train_number from train_arrive_at_station where station_name in (${"'" + list.join("','") + "'"}) group by train_number,date;`, { type: QueryTypes.SELECT }).then(function (result) {
            list = [];
            result.forEach(item => list.push(item.train_number));
        });
        return await this.findAll({
            attributes: ['train_number', 'start_station', 'end_station', 'first_class_ticket', 'second_class_ticket', 'third_class_ticket'],
            where: { date: date, train_number: list },
        }).
            catch(error => {
                console.log(error);
                return '查询失败';
            });
    }
    Train.findByCities = async function (start, end, date) {
        return await app.model.query(`SELECT get_train_number_by_cities('${start}', '${end}','${date}')`, { type: QueryTypes.SELECT });
    }
    Train.migrateAll = async function (date) {
        const fs = require("fs");
        trains = JSON.parse(fs.readFileSync("./database/seeders/train_common.json"));
        trains.forEach((item) => item['date'] = date);
        schedules = JSON.parse(fs.readFileSync("./database/seeders/schedule_common.json"));
        schedules.forEach((item) => item['date'] = date);
        await app.model.queryInterface.bulkInsert('trains', trains);
        await app.model.queryInterface.bulkInsert('train_arrive_at_station', schedules);

    }
    return Train;
};