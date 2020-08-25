var express = require('express');
var router = express.Router();

var xmlParser=require('body-parser').raw({
    type:'application/xml'
});
var { post,get } = require('./vtiger-xrso');
router.route('/vtiger-xrso').post(xmlParser,post);
router.route('/vtiger-xrso').get(get);
router.route('/test').get((req,res)=>{
	res.send('Hello World!')
})
module.exports = router;

