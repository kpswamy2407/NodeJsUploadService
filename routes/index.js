var express = require('express');
var router = express.Router();

var xmlParser=require('body-parser').raw({
    type:'application/xml'
});
var { post } = require('./xml-upload');
router.route('/xml-upload').post(xmlParser,post);

module.exports = router;
