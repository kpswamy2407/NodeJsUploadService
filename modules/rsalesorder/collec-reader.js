const { BaseCollection }=require('../../core');
const { __extends }=require('tslib');
/**
 * 
 * @see 
 * @since Fri October 04, 2019 04:52 PM.
 * @author nandha.viswanathan@sifycorp.com 
 */
var CollecReader=(function(){
	__extends(CollecReader,BaseCollection);
	function CollecReader(_collc){
		BaseCollection.call(this,_collc);
	};
	CollecReader.prototype.lineItems=function(){
		// get line items here
	};
	return CollecReader;
})();
module.exports=exports=CollecReader;
