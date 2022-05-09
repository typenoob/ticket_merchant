module.exports = app => {
    // 字段数据类型
    const { TEXT, DECIMAL, QueryTypes } = app.Sequelize;
    // model定义
    const Station = app.model.define('station', {
        station_name: { type: TEXT, primaryKey: true },
        lon: { type: DECIMAL(10, 2) },
        lat: { type: DECIMAL(10, 2) }
    }, { timestamps: false });

    Station.createByBody = async function (body) {
        const { name, lon, lat } = body;
        return await this.create({ station_name: name, lon: lon, lat: lat }).then(() => '添加成功').
            catch(error => {
                if (error.parent.code == '23505')
                    return '已存在相同站点名称';
            })

    }
    Station.deleteByName = async function (name) {
        return await this.destroy({ where: { station_name: name } }).then(() => '删除成功').
            catch(error => {
                console.log(error);
                return '删除失败';
            })
    }
    Station.findByPage = async function (page, limit) {
        return await this.findAll({ limit: limit, offset: (page - 1) * limit }).
            catch(error => {
                console.log(error);
                return '查询失败';
            })

    }
    Station.findLikeText = async function (text) {
        return await app.model.query(`select * from stations where station_name % '${text}'`, { type: QueryTypes.SELECT }).
            catch(error => {
                console.log(error);
                return '查询失败';
            });
    }
    Station.findTime = async function (number, date, name) {
        return await app.model.query(`select arrive_time,depart_time from train_arrive_at_station where train_number='${number}' and date=date '${date}' and station_name='${name}'`, { type: QueryTypes.SELECT }).
            catch(error => {
                console.log(error);
                return '查询失败';
            });
    }

    return Station;
};