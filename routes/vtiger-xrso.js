var XmlCtrl=require('./../controllers/xmlctrl');
const { HttpError }=require('./../core');
var {Sequelize,Transaction,QueryTypes} = require("sequelize");
const fs=require('fs');
const yaml=require('yaml');

function post(req,res,next){
    var app=req.app;
    const applog=app.get('applog');
    const dbconn=app.get('dbconn_'+req.params.client);
    var xmlstr=(req.body && req.body.toString()) || null;
    if(!xmlstr){
        throw new HttpError(500,'Request body is empty.');
    }
    var xmlcntrl=new XmlCtrl(xmlstr);
    xmlcntrl.setLog(applog);
    xmlcntrl.setDb(dbconn);
    xmlcntrl.import(req.params.client)
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
    const app=req.app;
    const applog=app.get('applog');
    const dbconn=app.get('dbconn_'+req.params.client);
    return dbconn.query("select id from vtiger_crmentity_seq limit 1").spread(seq=>{
         return res.json({
            status:seq.id,
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
