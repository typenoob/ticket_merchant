FROM node:14
COPY . /workdir
RUN apt-get update \
    && apt-get install -y postgresql sudo \
    && apt autoremove -y \
    && apt-get clean 

RUN service postgresql start
RUN service postgresql status
RUN sudo -u postgres bash -c "psql -h 0.0.0.0 -c \"CREATE DATABASE ticket_merchant;\"" \
    && sudo -u postgres bash -c "psql -h 0.0.0.0 -c \"CREATE USER coyote WITH PASSWORD '123456';\"" \
    && sudo -u postgres bash -c "psql -h 0.0.0.0 -c \"GRANT ALL PRIVILEGES ON DATABASE ticket_merchant TO coyote;\""

WORKDIR /workdir

RUN npm install --save-dev sequelize-cli \
    && npx:sequelize-cli db:migrate \
    && npx:sequelize-cli db:seed:all

RUN npm i

CMD ["npm" "start"]
