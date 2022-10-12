# ticket_merchant_backend

作为[ticket_merchant](https://github.com/typenoob/ticket_merchant_front_end)的后端，此项目利用[eggjs](https://www.eggjs.org/)+postgresql开发。 

## E-R图

![image](https://user-images.githubusercontent.com/61347081/195334205-0794d542-39f6-4dd6-8bec-378c4dbc60ae.png)

### 快速启动

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 部署

```bash
$ npm start
$ npm stop
```

### 使用sequelize迁移数据库

- Use `npx sequelize-cli db:migrate ` to migrate the db.
- Use `npx sequelize-cli db:migrate:undo ` to unmigrate the db.
