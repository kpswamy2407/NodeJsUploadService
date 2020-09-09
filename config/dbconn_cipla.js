const Sequelize=require('sequelize');
const { BaseModule }=require('../core');
const baseModule=new BaseModule();
const config = require('config-yml');
const cipla=config.config.cipla;
var database=cipla.FNXT_MYSQLDB;
const dbconn_cipla=new Sequelize(database,null,null,{
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
    port:cipla.FNXT_MYSQLPORT,
    replication:{
        read:[
            {
                host:cipla.FNXT_MYSQL_SLAVE_HOST,
                username:cipla.FNXT_MYSQL_SLAVE_USER,
                password:cipla.FNXT_MYSQL_SLAVE_PWD,   
            }
        ],
        write:{
            host:cipla.FNXT_MYSQLHOST,
            username:cipla.FNXT_MYSQLUSER,
            password:cipla.FNXT_MYSQLPWD,
        }
    }
});

module.exports=exports=dbconn_cipla;