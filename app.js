var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var logger = require('morgan');
logger.token('fnxt-date',function(req,res){
    return require('moment')().format('YYYY-MM-DD HH:mm:ss.SSS');
});
const log_dir=path.join(__dirname, 'public','logs');
var logStream=require('rotating-file-stream')('access.log',{
    interval: '1d',
    path:log_dir
});

var app = express();

// application file logger
(function(){
    const opts={
        errorEventName:'error',
        logDirectory:log_dir, // NOTE: folder must exist and be writable...
        fileNamePattern:'application.log',
        dateFormat:'YYYY.MM.DD',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS',
    };
    const log=require('simple-node-logger').createRollingFileLogger( opts );
    log.setLevel('all');
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
app.use('/xml-upload',require('./routes/xml-upload'));

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
    app.get('applog').fatal(err.message);
    res.status(500).json({
        status:0,
        msg:'Error while processing your request.',
        data:null,
    });
});

module.exports = app;
