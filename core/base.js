const BaseError=require('./base-error');
/**
 * Base class shares all the utility methods.
 * Nearly all objects must inherit this class.
 * @see 
 * @since Tue October 01, 2019 05:24 PM.
 * @author nandha.viswanathan@sifycorp.com 
 */
var Base=(function(){
    function Base(){
        var __log;
        this.setLog=function(log){
            __log=log;
        }
        this.getLog=function(){
            if(__log==undefined || __log==null){
                throw new BaseError('Logger has NOT been set.');
            }
            return __log;
        }
        var __dbconn;
        this.setDb=function(log){
            __dbconn=log;
        }
        this.getDb=function(){
            if(__dbconn==undefined || __dbconn==null){
                throw new BaseError('DB connection has NOT been set.');
            }
            return __dbconn;
        }
    }
    Base.GetKey=function(collc,key){

    }
    Base.prototype.debug=function(msg){
        this.getLog().debug(msg);
    }
    Base.prototype.info=function(msg){
        this.getLog().info(msg);
    }
    Base.prototype.trace=function(msg){
        this.getLog().trace(msg);
    }
    Base.prototype.fatal=function(msg){
        this.getLog().fatal(msg);
    }
    return Base;
})();
module.exports=exports=Base;
