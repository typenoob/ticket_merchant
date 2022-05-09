FROM postgres:14.2
COPY . /workdir

WORKDIR /workdir
RUN apt-get update \
    && apt-get install -y nodejs \
    && apt autoremove -y \
    && apt-get clean 

COPY entrypoint.sh /docker-entrypoint-initdb.d
COPY init.sql /docker-entrypoint-initdb.d
