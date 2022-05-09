module.exports = app => {
    const { TEXT, CHAR, UUID } = app.Sequelize;
    const Passenger = app.model.define('passenger', {
        card_number: { type: CHAR(18), primaryKey: true },
        name: { type: TEXT },
        phone: { type: CHAR(11) },
        user_id: { type: TEXT, allowNull: false, },
    }, { timestamps: false });
    Passenger.addByCardAndName = async function (number, name, phone, id) {
        return await this.create({ card_number: number, name: name, phone: phone, user_id: id }).then
            (() => '添加成功').
            catch(error => {
                console.log(error); if (error.parent.code == '23505')
                    return '该乘客已被绑定至其他账号';
                else return '添加失败';
            });
    }
    Passenger.findByID = async function (id) {
        return await this.findAll({ where: { user_id: id } }).
            catch(error => {
                console.log(error);
                return '查询失败';
            })
    }
    Passenger.findNameByID = async function (id) {
        return await this.findAll({ where: { user_id: id } }).then(data => { return data.map(item => item.name) }).
            catch(error => {
                console.log(error);
                return '查询失败';
            })
    }
    Passenger.deleteByID = async function (number) {
        return await this.destroy({ where: { card_number: number } }).then
            (() => '删除成功').
            catch(error => { console.log(error); return ('删除失败') });
    }
    Passenger.findIDByName = async function (name, id) {
        return await this.findOne({ attributes: ['card_number'], where: { name: name, user_id: id } }).
            catch(error => { console.log(error); return ('查询失败') });
    }
    return Passenger;
};