/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = { identify: { ignore: '/api/v1/sessions' }, };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1649847208583_1653';
  config.security = {
    csrf: {
      enable: false,
    }, domainWhiteList: ['http://127.0.0.1:8080'],
  }
  config.cors = {
    credentials: true,
    origin: ctx => ctx.get('origin'),
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };
  config.sequelize = {
    dialect: 'postgres', // 支持 mysql, mariadb, postgres, mssql等数据库
    database: 'ticket_merchant', // 数据库名称
    host: 'localhost',    // 服务主机地址
    port: 5432,   // 端口
    username: 'coyote', // 用户名
    password: '123456', // 密码

    // 其他默认配置参数
  };
  //config.middleware = ['identify'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
