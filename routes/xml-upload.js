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
    
    const XSeries=dbconn.import('./../models/x-series');
    const XSeriesCf=dbconn.import('./../models/x-series-cf');
    const tras= dbconn.query("SELECT mt.*, rt.* FROM vtiger_xtransactionseries mt LEFT JOIN vtiger_xtransactionseriescf rt ON mt.xtransactionseriesid = rt.xtransactionseriesid  WHERE rt.cf_xtransactionseries_transaction_type=? and mt.xdistributorid=? order by cf_xtransactionseries_mark_as_default desc, xtransactionseriesid desc limit 1",{
        type:QueryTypes.SELECT,
        replacements:['Sales Order',16950298]
    }).spread(async(series)=>{
        console.log(series);
        return res.json({
            status:series,
            msg:'Upload service has been done.',
            data:null,
        });
    })

    /*
const CrmEntitySeq=dbconn.import('./../models/crmentityseq');
    return CrmEntitySeq.fnxtIncrement().then(id=>{
       return res.json({
            status:id,
            msg:'Upload service has been done.',
            data:null,
        });
    
    });*/

   
}
module.exports=exports={
    post,get
};
