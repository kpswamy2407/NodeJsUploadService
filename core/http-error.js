const { __extends }=require('tslib');
const BaseError=require('./base-error');
/**
 * 
 * @see 
 * @since Tue October 01, 2019 05:31 PM.
 * @author nandha.viswanathan@sifycorp.com 
 */
var HttpError=(function(){
    __extends(HttpError,BaseError);
    function HttpError(statusCode,msg){
        var _this=BaseError.call(this,msg);
        _this.statusCode=statusCode;
        return _this;
    }
    return HttpError;
})();
module.exports=exports=HttpError;