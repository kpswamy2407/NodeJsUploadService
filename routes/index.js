var express = require('express');
var router = express.Router();
const logs_folder=require('path').join(__dirname,'..','public','logs');
const uploads_folder=require('path').join(__dirname,'..','public');
var xmlParser=require('body-parser').raw({
    type:'application/xml'
});

var serveIndex = require('serve-index');

var { post,get } = require('./vtiger-xrso');
router.use('/vtiger-xrso/logs',[
    express.static(logs_folder),
]);
router.use('/vtiger-xrso/uploads',[
	express.static(uploads_folder), 
	serveIndex(uploads_folder,{view:'details',icons:true})
]);
router.route('/vtiger-xrso/:client').post(xmlParser,post);
router.route('/vtiger-xrso/:client').get(get);

router.route('/vtiger-xrso/test/:client').get((req,res)=>{
	const dbconn=req.app.get('dbconn_'+req.params.client);
	dbconn.authenticate().then(function(){
   	res.send("DB oK");   
 }).catch(function(err){
   	res.send(err.message);
  });
});
module.exports = router;

