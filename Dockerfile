FROM node:14

WORKDIR /workdir

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 7001

CMD ["npm","start"]
