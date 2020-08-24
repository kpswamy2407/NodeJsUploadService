FROM node:10-alpine
ENV FNXT_MYSQLDB forum
ENV FNXT_MYSQLPORT 3306
ENV FNXT_MYSQLHOST 127.0.0.1
ENV FNXT_MYSQLUSER root
ENV FNXT_MYSQLPWD Nop@ssword4u
ENV FNXT_MYSQL_SLAVE_HOST 127.0.0.1
ENV FNXT_MYSQL_SLAVE_USER root
ENV FNXT_MYSQL_SLAVE_PWD Nop@ssword4u
ENV FNXT_WORKER_LENGTH 4

RUN mkdir -p /home/node/sales-order/node_modules && mkdir -p /home/node/sales-order/public

WORKDIR /home/node/sales-order

COPY  "." "."

RUN npm install

CMD [ "npm", "run", "fnxt.start" ]


