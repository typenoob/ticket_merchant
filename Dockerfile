FROM node:14
COPY . /workdir

WORKDIR /workdir

RUN npm install --save-dev sequelize-cli \
    && npx:sequelize-cli db:migrate \
    && npx:sequelize-cli db:seed:all

RUN npm i

CMD ["npm" "start"]
