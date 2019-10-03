var XmlCtrl=require('./../controllers/xmlctrl');
const { HttpError }=require('./../core');

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
    .catch( err => next(err));
}

module.exports=exports={
    post,
};
