var express = require('express');
var router = express.Router();
var XmlCtrl=require('./../controllers/xmlctrl');

/* GET home page. */
router.post('/', function(req, res, next) {
    var app=req.app;
    var xmlcntrl=new XmlCtrl();
    xmlcntrl.setLog(app.get('applog'));
    xmlcntrl.saveXml().then( _ => {
        res.json({
            status:'1',
            msg:'Upload service has been done.',
            data:null,
        });
    }).catch( err => {
        next(err)
    });
});

module.exports = router;
