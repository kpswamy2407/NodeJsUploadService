const Sequelize=require('sequelize');
const { BaseModule }=require('../core');
const baseModule=new BaseModule();
const config = require('config-yml');
const demo=config.config.demo;
var database=demo.FNXT_MYSQLDB;
const dbconn_demo=new Sequelize(database,null,null,{
    dialect: 'mysql',
    timezone:'+05:30',
    logging:false,
    pool: {
            max: 30,
            min: 0,
            acquire: 60000,
            idle: 5000
    },
    logQueryParameters:true,
    port:demo.FNXT_MYSQLPORT,
    replication:{
        read:[
            {
                host:demo.FNXT_MYSQL_SLAVE_HOST,
                username:demo.FNXT_MYSQL_SLAVE_USER,
                password:demo.FNXT_MYSQL_SLAVE_PWD,   
            }
        ],
        write:{
            host:demo.FNXT_MYSQLHOST,
            username:demo.FNXT_MYSQLUSER,
            password:demo.FNXT_MYSQLPWD,
        }
    }
});
module.exports=exports=dbconn_demo;