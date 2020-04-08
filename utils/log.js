const { __extends }=require('tslib');
const { Base, BaseError }=require('./../core');
const fs=require('fs');
var moment = require('moment');

/**
 * 
 * @see 
 * @author kpswamy540@gmail.com.
 * @since Fri October 25, 2019 03:29 PM.
 */
var Log=(function(){
   __extends(Log,Base);
   function Log(fileName,logFilePath){
      Base.call(this);
      Object.defineProperty(this,'fileName',{
            value:fileName,
            configurable:false,
            writable:false,
            enumerable:true,
        });
      fs.open(fileName, 'w', function (err, file) {
         console.log(fileName);
         if (err) throw err;
      });
   };
   const SimpleNodeLogger = require('simple-node-logger'),
   manager=new SimpleNodeLogger();
    opts = {
        logFilePath:this.fileName,
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS',
        appenders:manager.createFileAppender( { logFilePath:this.fileName } )
    },


logger = SimpleNodeLogger.createSimpleFileLogger( opts );

 logger.setLevel('info');
   
   console.log(this.fileName);
   
   
   Log.prototype.info=function(message){
      logger.info(message);
      return true;
   };
   
   return Log;
})();
module.exports=exports=Log;
