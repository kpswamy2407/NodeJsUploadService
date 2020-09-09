const Sequelize=require('sequelize');
const { BaseModule }=require('../core');
const baseModule=new BaseModule();
const config = require('config-yml');
const panasonic=config.config.panasonic;
var database=panasonic.FNXT_MYSQLDB;
const dbconn_panasonic=new Sequelize(database,null,null,{
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
    port:panasonic.FNXT_MYSQLPORT,
    replication:{
        read:[
            {
                host:panasonic.FNXT_MYSQL_SLAVE_HOST,
                username:panasonic.FNXT_MYSQL_SLAVE_USER,
                password:panasonic.FNXT_MYSQL_SLAVE_PWD,   
            }
        ],
        write:{
            host:panasonic.FNXT_MYSQLHOST,
            username:panasonic.FNXT_MYSQLUSER,
            password:panasonic.FNXT_MYSQLPWD,
        }
    }
});
module.exports=exports=dbconn_panasonic;