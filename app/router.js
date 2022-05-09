'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const apiV1Router = router.namespace('/api/v1')
  apiV1Router.get('/login', controller.login.index); //登录
  apiV1Router.get('/stations', controller.station.showStation); //根据页数、每页限制数量展示车站
  apiV1Router.get('/stations/:text', controller.station.getStation); //模糊查询车站
  apiV1Router.post('/stations', controller.station.addStation); //添加车站
  apiV1Router.delete('/stations/:name', controller.station.deleteStation); //根据名称删除车站
  apiV1Router.get('/stations/city/:city', controller.station.getExactName); //获得具体的车站名称
  apiV1Router.get('/tickets/any', controller.ticket.getAnyTicket); //根据车次、日期、等级随机获得一张车票
  apiV1Router.get('/tickets/id/:id', controller.ticket.getTicketByID); // 根据id获得一张车票 
  apiV1Router.get('/tickets', controller.ticket.showTicket); //根据页数、每页限制数量、等级、日期展示车票
  apiV1Router.get('/tickets/:number', controller.ticket.getTicket); //根据车次查询车票
  apiV1Router.post('/tickets', controller.ticket.modifyTicket); //使用主键确定唯一车次后,根据车票等级和增加量调整票量
  apiV1Router.post('/tickets/purchase/:id/:start/to/:end', controller.ticket.TicketSold); //买票
  apiV1Router.post('/tickets/refund/:id', controller.ticket.TicketRefund); //退票
  apiV1Router.get('/trains/search/:text', controller.train.searchTrain); //模糊查询车次
  apiV1Router.get('/tickets/:start/to/:end', controller.ticket.getPrice); // 计算价格
  apiV1Router.get('/trains', controller.train.showTrain); //根据页数、每页限制数量、日期展示车次
  apiV1Router.get('/trains/:number/stations', controller.train.getThroughStation); // 使用主键确定唯一车次后,查询经停站
  apiV1Router.post('/trains/:number', controller.train.addTrain); // 添加车次
  apiV1Router.delete('/trains/:number', controller.train.deleteTrain); // 删除车次
  apiV1Router.get('/trains/:number/stations/:name', controller.train.getTrainArriveTime); // 根据车次和站名查找到达和离开时间
  apiV1Router.post('/passengers/:number', controller.passenger.addPassenger); // 添加乘客(姓名、身份证号、手机号)
  apiV1Router.get('/passengers/card/', controller.passenger.getPassengerCard); // 根据id和姓名查询乘客
  apiV1Router.get('/passengers/:id', controller.passenger.getPassenger); // 根据id查询乘客
  apiV1Router.get('/passengers/names/:id', controller.passenger.getPassengerName); // 根据id查询乘客姓名
  apiV1Router.delete('/passengers/:number', controller.passenger.deletePassenger); // 根据身份账号删除乘客
  apiV1Router.get('/trains/:start/to/:end', controller.train.searchTrainBetween); // 根据两地名称查询车次
  apiV1Router.post('/orders/transaction', controller.order.addOrder); // 新建订单
  apiV1Router.post('/orders/:id/success', controller.order.changeOrderToSuc); // 修改订单状态为成功
  apiV1Router.post('/orders/:id/error', controller.order.changeOrderToError); // 修改订单状态为失败
  apiV1Router.get('/orders', controller.order.getOrder); // 查询订单
  apiV1Router.post('/migration', controller.train.migrate);
  apiV1Router.post('/sessions', controller.session.create);
};
