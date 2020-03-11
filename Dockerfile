FROM node:10-alpine

RUN mkdir -p /home/node/sales-order/node_modules && chown -R node:node /home/node/sales-order

WORKDIR /home/node/sales-order

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "node", "./bin/www" ]


