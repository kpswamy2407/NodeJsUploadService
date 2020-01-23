var express = require('express');
var router = express.Router();

var xmlParser=require('body-parser').raw({
    type:'application/xml'
});
var { post,get } = require('./xml-upload');
router.route('/xml-upload').post(xmlParser,post);
router.route('/xml-upload').get(get);
module.exports = router;
