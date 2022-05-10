# ticket_merchant_backend



## QuickStart

<!-- add docs here for user -->
`docker-compose up`

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org

### DateBase

- Use `npx sequelize-cli db:migrate ` to migrate the db.
- Use `npx sequelize-cli db:migrate:undo ` to unmigrate the db.
