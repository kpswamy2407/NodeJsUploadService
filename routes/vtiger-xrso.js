var XmlCtrl=require('./../controllers/xmlctrl');
const { HttpError }=require('./../core');
var {Sequelize,Transaction,QueryTypes} = require("sequelize");
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
    .catch( err=>{
        console.log('error in route',err);
    });
}
function get(req,res,next){
    var app=req.app;
    const applog=app.get('applog');
    const dbconn=app.get('dbconn');
    const CrmEntitySeq=dbconn.import('./../models/crmentityseq');
    return CrmEntitySeq.fnxtIncrement().then(id=>{
       return res.json({
            status:id,
            msg:'Upload service has been done.',
            data:null,
        });
    
    }).catch(e=>{
        return res.json({
            status:e.message,
            msg:'Upload service has been done.',
            data:null,
        });
    });

   
}
module.exports=exports={
    post,get
};
