const { Base }=require('./base');
const { __extends }=require('tslib');
/**
 * 
 * @see 
 * @since Tue October 04, 2019 12:24 PM.
 * @author pedda.swamy@sifycorp.com 
 */
var BaseModule=(function(){
    __extends(BaseModule,Base);
    function BaseModule(xmljs){
        Base.call(this);
        Object.defineProperty(this,'_xmljs',{
            value:xmljs,
            configurable:false,
            writable:false,
            enumerable:true,
        });
    }
    BaseModule.prototype.getServiceName = function() {
    	console.log(this._xmljs);
    };
    return BaseModule;
})();
module.exports=exports=BaseModule;