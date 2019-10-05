/**
 * 
 * @see 
 * @since Tue October 01, 2019 05:31 PM.
 * @author nandha.viswanathan@sifycorp.com 
 */
class BaseError extends Error{
	constructor(msg){
		super(msg);
	};
}
module.exports=exports=BaseError;