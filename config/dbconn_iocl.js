const Sequelize=require('sequelize');
const { BaseModule }=require('../core');
const baseModule=new BaseModule();
const config = require('config-yml');
const iocl=config.config.iocl;
var database=iocl.FNXT_MYSQLDB;
const dbconn_iocl=new Sequelize(database,null,null,{
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
    port:iocl.FNXT_MYSQLPORT,
    replication:{
        read:[
            {
                host:iocl.FNXT_MYSQL_SLAVE_HOST,
                username:iocl.FNXT_MYSQL_SLAVE_USER,
                password:iocl.FNXT_MYSQL_SLAVE_PWD,   
            }
        ],
        write:{
            host:iocl.FNXT_MYSQLHOST,
            username:iocl.FNXT_MYSQLUSER,
            password:iocl.FNXT_MYSQLPWD,
        }
    }
});
module.exports=exports=dbconn_iocl;