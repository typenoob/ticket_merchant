module.exports = app => {
    // 字段数据类型
    const { TEXT, UUID, BOOLEAN, INTEGER, DATEONLY, QueryTypes } = app.Sequelize;
    // model定义
    const Ticket = app.model.define('ticket', {
        ticket_id: { type: UUID, allowNull: false, primaryKey: true, defaultValue: app.model.literal('uuid_generate_v1()') },
        start_station: { type: TEXT, allowNull: false },
        end_station: { type: TEXT, allowNull: false },
        class: { type: INTEGER, allowNull: false },
        is_sold: { type: BOOLEAN, allowNull: false, defaultValue: false },
        date: { type: DATEONLY, allowNull: false, default: app.model.literal('CURRENT_DATE') },
        train_number: { type: TEXT, allowNull: false },
    }, { timestamps: false });
    Ticket.findByPage = async function (page, limit) {
        return await this.findAll({ limit: limit, offset: (page - 1) * limit }).
            catch(error => {
                console.log(error);
                return '查询失败';
            })
    }
    Ticket.findAny = async function (number, date, level) {
        return await this.findOne({ where: { train_number: number, date: date, class: level, is_sold: false }, lock: true, skipLocked: true }).catch(error => {
            console.log(error);
            return '查询失败';
        });
    }
    Ticket.findByID = async function (id) {
        return await this.findOne({ attributes: ['train_number', 'start_station', 'end_station', ['class', 'level']], where: { ticket_id: id } }).catch(error => {
            console.log(error);
            return '查询失败';
        });
    }
    Ticket.sold = async function (start, end, id) {
        return await app.model.query(`CALL purchase_ticket(
            '${start}','${end}','${id}'
        )`).then(() => '购买成功').catch(error => { console.log(error); return '购买失败' });
    }
    Ticket.refund = async function (id) {
        return await this.update({ is_sold: false }, { where: { ticket_id: id } }).then(() => '退款成功').catch(error => { console.log(error); return '退款失败'; });
    }
    Ticket.computePrice = async function (start, end, level) {
        return await app.model.query(`SELECT lon as lon1,lat as lat1 FROM stations WHERE station_name = '${start}'`, { type: QueryTypes.SELECT })
            .then(async function (value) {
                const { lon1, lat1 } = value[0];
                return await app.model.query(`SELECT lon as lon2,lat as lat2 FROM stations WHERE station_name = '${end}'`, { type: QueryTypes.SELECT }).then(async function (value) {
                    const { lon2, lat2 } = value[0];
                    return await app.model.query(`SELECT public.get_distance(
                        ${lon1},${lat1},${lon2},${lat2}
                    )`, { type: QueryTypes.SELECT }).then(function (value) {
                        if (level == 1) { return value[0]['get_distance'] * 0.001 } else if (level == 2) { return value[0]['get_distance'] * 0.0007 } else { return value[0]['get_distance'] * 0.0005 }
                    }).catch(error => console.log(error));
                }).catch(error => { console.log(error); return '查询失败' });
            }).catch(error => { console.log(error); return '查询失败' });
    }


    return Ticket;
};