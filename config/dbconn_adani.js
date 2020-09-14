const Sequelize=require('sequelize');
const { BaseModule }=require('../core');
const baseModule=new BaseModule();
const config = require('config-yml');
const adani=config.config.adani;
var database=adani.FNXT_MYSQLDB;
const dbconn_adani=new Sequelize(database,null,null,{
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
    port:adani.FNXT_MYSQLPORT,
    replication:{
        read:[
            {
                host:adani.FNXT_MYSQL_SLAVE_HOST,
                username:adani.FNXT_MYSQL_SLAVE_USER,
                password:adani.FNXT_MYSQL_SLAVE_PWD,   
            }
        ],
        write:{
            host:adani.FNXT_MYSQLHOST,
            username:adani.FNXT_MYSQLUSER,
            password:adani.FNXT_MYSQLPWD,
        }
    }
});

module.exports=exports=dbconn_adani;