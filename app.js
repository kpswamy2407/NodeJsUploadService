require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const log_dir=path.join(__dirname, 'public','logs');
const dbconn_cipla=require('./config/dbconn_cipla');
const dbconn_tide=require('./config/dbconn_tide');
const dbconn_demo=require('./config/dbconn_demo');
const dbconn_panasonic=require('./config/dbconn_panasonic');
const dbconn_iocl=require('./config/dbconn_iocl');
const dbconn_adani=require('./config/dbconn_adani');

logger.token('fnxt-date',function(req,res){
    return require('moment')().format('YYYY-MM-DD HH:mm:ss.SSS');
});
var logStream=require('rotating-file-stream')('xrso-access.log',{
    interval: '1d',
    path:log_dir
});

var app = express();
global.__log_dir = log_dir;
// setting up db connection
app.set('dbconn_cipla',dbconn_cipla);
app.set('dbconn_tide',dbconn_tide);
app.set('dbconn_demo',dbconn_demo);
app.set('dbconn_panasonic',dbconn_panasonic);
app.set('dbconn_iocl',dbconn_iocl);
app.set('dbconn_adani',dbconn_adani);



// application file logger
(function(){
    const opts={
        errorEventName:'error',
        logDirectory:log_dir, // NOTE: folder must exist and be writable...
        fileNamePattern:'xrso-application.log',
        dateFormat:'YYYY.MM.DD',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS',
        level:'all',
    };
    const log=require('simple-node-logger').createRollingFileLogger( opts );
    app.set('applog',log);
})();

app.use(logger(":fnxt-date :remote-addr :method :url :req[content-length] :status",{
    stream:logStream,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',require('./routes/index'));

// invalid routes
app.all('*',function(req,res,next){
    res.status(404).json({
        status:'0',
        msg:'Invalid URL',
        data:null,
    });
});

// error handling
app.use(function(err,req,res,next){
    console.log(err);
    res.status(500).json({
        status:0,
        msg:err.message,
        data:null,
    });
});

module.exports = app;
