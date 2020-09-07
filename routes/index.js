var express = require('express');
var router = express.Router();
const logs_folder=require('path').join(__dirname,'..','public','logs');
const uploads_folder=require('path').join(__dirname,'..','public','iocl','uploads');
var xmlParser=require('body-parser').raw({
    type:'application/xml'
});

var serveIndex = require('serve-index');

var { post,get } = require('./vtiger-xrso');
router.use('/iocl/vtiger-xrso/logs',[
    
    express.static(logs_folder),
]);
router.use('/iocl/vtiger-xrso/uploads',[
	express.static(uploads_folder), 
	serveIndex(uploads_folder)
]);
router.route('/iocl/vtiger-xrso').post(xmlParser,post);
router.route('/iocl/vtiger-xrso').get(get);

router.route('/iocl/vtiger-xrso/test').get((req,res)=>{
	const dbconn=req.app.get('dbconn');
	dbconn.authenticate().then(function(){
   	res.send("DB oK");   
 }).catch(function(err){
   	res.send(err.message);
  });
});
module.exports = router;

