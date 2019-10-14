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
		Object.defineProperty(this,'_collc',{
            value:Object.assign({},_collc),
            enumerable:false,
            writable:false,
            configurable:false,
        });
	};
	CollecReader.prototype.lineItems=function(){
		// get line items here
	};
	CollecReader.prototype.subject=function(){
		try{
			return this._collc.collections.vtiger_xrso.subject._text;
		}catch(e){
			throw new Error('Unable to get subject');
		}
	}
	CollecReader.prototype.xrso= async function(){
		try{
			return this._collc.collections.vtiger_xrso;
		}
		catch(e){
			throw new Error('Unable to get the vtiger_xrso');
		}
	}
	return CollecReader;
})();
module.exports=exports=CollecReader;
