FROM node:10.15.2
RUN apt update -y
RUN apt install nano -y
RUN npm install pm2 -g

RUN mkdir -p /home/node/sales-order/node_modules && mkdir -p /home/node/sales-order/public
WORKDIR /home/node/sales-order

COPY  "." "."


ENV FNXT_MYSQLDB GSKL2018
ENV FNXT_MYSQLPORT 3306
ENV FNXT_MYSQLHOST fnxt.cjujx2esp70l.ap-south-1.rds.amazonaws.com
ENV FNXT_MYSQLUSER GSKL2018
ENV FNXT_MYSQLPWD  GSKL2018
ENV FNXT_MYSQL_SLAVE_HOST fnxt.cjujx2esp70l.ap-south-1.rds.amazonaws.com
ENV FNXT_MYSQL_SLAVE_USER GSKL2018
ENV FNXT_MYSQL_SLAVE_PWD  GSKL2018
ENV FNXT_WORKER_LENGTH 4 
RUN npm install --production

RUN [ "npm", "run", "fnxt.db-master" ]
RUN [ "npm", "run", "fnxt.db-slave" ]
CMD [ "npm", "run", "fnxt.start" ]


