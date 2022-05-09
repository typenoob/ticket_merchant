FROM postgres:14.2
COPY . /workdir

WORKDIR /workdir
RUN apt-get update \
    && apt-get install -y nodejs \
    && apt autoremove -y \
    && apt-get clean 

WORKDIR /workdir
RUN su postgres \
    && createdb ticket_merchant 

RUN npx sequelize-cli db:migrate \
    && npx sequelize-cli db:seed:all
    

ENTRYPOINT ["/workdir/entrypoint.sh"]
