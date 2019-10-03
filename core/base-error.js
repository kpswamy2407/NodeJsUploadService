const { __extends }=require('tslib');
/**
 * 
 * @see 
 * @since Tue October 01, 2019 05:31 PM.
 * @author nandha.viswanathan@sifycorp.com 
 */
var BaseError=(function(){
    __extends(BaseError,Error);
    function BaseError(msg){
        return Error.call(this,msg);
    }
    return BaseError;
})();
module.exports=exports=BaseError;