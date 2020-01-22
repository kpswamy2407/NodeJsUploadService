require('dotenv').config({
    path:'./config/env'
});

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const log_dir=path.join(__dirname, 'public','logs');
const dbconn=require('./config/dbconn');

logger.token('fnxt-date',function(req,res){
    return require('moment')().format('YYYY-MM-DD HH:mm:ss.SSS');
});
var logStream=require('rotating-file-stream')('access.log',{
    interval: '1d',
    path:log_dir
});

var app = express();
global.__log_dir = log_dir;
// setting up db connection
app.set('dbconn',dbconn);

// application file logger
(function(){
    const opts={
        errorEventName:'error',
        logDirectory:log_dir, // NOTE: folder must exist and be writable...
        fileNamePattern:'application.log',
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
/*app.all('*',function(req,res,next){
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl);
    res.status(404).json({
        status:'0',
        msg:'Invalid URL',
        data:null,
    });
});*/

// error handling
app.use(function(err,req,res,next){
    res.status(500).json({
        status:0,
        msg:err.message,
        data:null,
    });
});

module.exports = app;
