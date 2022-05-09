FROM postgres:14.2
COPY . /workdir
ENV POSTGRES_USER coyote
ENV POSTGRES_PASSWORD 123456
ENV POSTGRES_DB ticket_merchant

WORKDIR /workdir
RUN apt-get update \
    && apt-get install -y nodejs npm \
    && apt autoremove -y \
    && apt-get clean \
    && npm install --save-dev sequelize-cli \
    && npx sequelize-cli db:migrate \
    && npx sequelize-cli db:seed:all

COPY entrypoint.sh /docker-entrypoint-initdb.d
RUN chown -R postgres:postgres /docker-entrypoint-initdb.d/

