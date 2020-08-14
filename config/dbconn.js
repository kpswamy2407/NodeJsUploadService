const Sequelize=require('sequelize');
var database=process.env.FNXT_MYSQLDB;
const { BaseModule }=require('../core');
const baseModule=new BaseModule();
const dbconn=new Sequelize(database,null,null,{
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
    port:process.env.FNXT_MYSQLPORT,
    replication:{
        read:[
            {
                host:process.env.FNXT_MYSQL_SLAVE_HOST,
                username:process.env.FNXT_MYSQL_SLAVE_USER,
                password:process.env.FNXT_MYSQL_SLAVE_PWD,   
            }
        ],
        write:{
            host:process.env.FNXT_MYSQLHOST,
            username:process.env.FNXT_MYSQLUSER,
            password:process.env.FNXT_MYSQLPWD,
        }
    }
});

module.exports=exports=dbconn;