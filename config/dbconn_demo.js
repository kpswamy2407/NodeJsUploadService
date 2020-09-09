const Sequelize=require('sequelize');
const { BaseModule }=require('../core');
const baseModule=new BaseModule();
const config = require('config-yml');
const tide=config.config.tide;
var database=tide.FNXT_MYSQLDB;
const dbconn_tide=new Sequelize(database,null,null,{
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
    port:tide.FNXT_MYSQLPORT,
    replication:{
        read:[
            {
                host:tide.FNXT_MYSQL_SLAVE_HOST,
                username:tide.FNXT_MYSQL_SLAVE_USER,
                password:tide.FNXT_MYSQL_SLAVE_PWD,   
            }
        ],
        write:{
            host:tide.FNXT_MYSQLHOST,
            username:tide.FNXT_MYSQLUSER,
            password:tide.FNXT_MYSQLPWD,
        }
    }
});
module.exports=exports=dbconn_tide;