var XmlCtrl=require('./../controllers/xmlctrl');
const { HttpError }=require('./../core');
const Sequelize=require('sequelize');
var database=process.env.FNXT_MYSQLDB;
function post(req,res,next){
    var app=req.app;
    const applog=app.get('applog');
    const dbconn=app.get('dbconn');
    var xmlstr=(req.body && req.body.toString()) || null;
    if(!xmlstr){
        throw new HttpError(500,'Request body is empty.');
    }
    var xmlcntrl=new XmlCtrl(xmlstr);
    xmlcntrl.setLog(applog);
    xmlcntrl.setDb(dbconn);
    xmlcntrl.import()
    .then(()=>{
        res.json({
            status:'1',
            msg:'Upload service has been done.',
            data:null,
        });
    })
    .catch( err => next('err'));
}
function get(req,res,next){
    var app=req.app;
    const applog=app.get('applog');
    // const dbconn=app.get('dbconn');
    const dbconn=new Sequelize(database,null,null,{
    dialect: 'mysql',
    timezone:'+05:30',
    logging:false,
   /* pool: {
        max: 151,
        min: 1,
        idle: 500
    },*/
    //logging:console.log,
    //benchmark:true,
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
    
    const CrmEntitySeq=dbconn.import('./../models/crmentityseq');
    console.log(CrmEntitySeq);
    return CrmEntitySeq.fnxtIncrement().then(id=>{
        console.log(id);
       return res.json({
            status:id,
            msg:'Upload service has been done.',
            data:null,
        });
    
    })/*.catch( err =>{
        console.log(err);
    })*/.
    finally(()=>{
        dbconn.close();
    });
   
}
module.exports=exports={
    post,get
};
