const { __extends } = require('tslib');
const { Base,BaseError} = require('./../core');
const fs = require('fs');
var moment = require('moment');
var path = require('path');

/**
 * 
 * @see 
 * @author kpswamy540@gmail.com.
 * @since Fri October 25, 2019 03:29 PM.
 */
var Log = (function() {
    __extends(Log, Base);

    function Log(fileName) {
        Base.call(this);
        Object.defineProperty(this, 'fileName', {
            value: fileName,
            configurable: false,
            writable: false,
            enumerable: true,
        });
        fs.open(fileName, 'w', function(err, file) {

            if (err) {
                console.log(err);
            };
        });

    };
    Log.prototype.logger = null;
    Log.prototype.setLogger = function() {
        var self = this;
        const SimpleNodeLogger = require('simple-node-logger');
         var options = {
            logFilePath: this.fileName,
            timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
        };
        self.logger = SimpleNodeLogger.createSimpleFileLogger(options);
        self.logger.setLevel('all');
        
    }
   Log.prototype.info = function(message) {
         this.logger.info(message);
    }
   Log.prototype.error = function(message) {
          this.logger.error(message);
   }
   Log.prototype.debug = function(message) {
          this.logger.debug(message);
   }
   return Log;
})();
module.exports = exports = Log;