const Sequelize=require('sequelize');
var database=process.env.FNXT_MYSQLDB;
const dbconn=new Sequelize(database,null,null,{
    dialect: 'mysql',
    logging: false,
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