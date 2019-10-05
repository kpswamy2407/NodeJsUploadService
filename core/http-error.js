const BaseError=require('./base-error');
/**
 * 
 * @see 
 * @since Tue October 01, 2019 05:31 PM.
 * @author nandha.viswanathan@sifycorp.com 
 */
class HttpError extends BaseError{
	constructor(code,msg){
		super(msg);
		this.code=code;
	};
};
module.exports=exports=HttpError;