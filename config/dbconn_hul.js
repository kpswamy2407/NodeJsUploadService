const Sequelize=require('sequelize');
const { BaseModule }=require('../core');
const baseModule=new BaseModule();
const config = require('config-yml');
const hul=config.config.hul;
var database=hul.FNXT_MYSQLDB;
const dbconn_hul=new Sequelize(database,null,null,{
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
    port:hul.FNXT_MYSQLPORT,
    replication:{
        read:[
            {
                host:hul.FNXT_MYSQL_SLAVE_HOST,
                username:hul.FNXT_MYSQL_SLAVE_USER,
                password:hul.FNXT_MYSQL_SLAVE_PWD,   
            }
        ],
        write:{
            host:hul.FNXT_MYSQLHOST,
            username:hul.FNXT_MYSQLUSER,
            password:hul.FNXT_MYSQLPWD,
        }
    }
});

module.exports=exports=dbconn_hul;