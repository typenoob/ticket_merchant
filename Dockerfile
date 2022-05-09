FROM postgres
COPY . /workdir

WORKDIR /workdir
RUN apt-get update \
    && apt-get install -y nodejs \
    && apt autoremove -y \
    && apt-get clean \

WORKDIR /workdir
ENTRYPOINT ["/workdir/entrypoint.sh"]
