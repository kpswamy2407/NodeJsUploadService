const { Base }=require('./../core');
const { __extends }=require('tslib');

/**
 * 
 * @see 
 * @since Tue October 01, 2019 05:24 PM.
 * @author nandha.viswanathan@sifycorp.com 
 */
var XmlCtrl=(function(){
    __extends(XmlCtrl,Base);
    function XmlCtrl(xmlstr){
        Base.call(this);
        Object.defineProperty(this,'xmlstr',{
            value:xmlstr,
            configurable:false,
            writable:false,
            enumerable:true,
        });
    }
    XmlCtrl.prototype.import=function(){
        return this.saveXml()
        .then(() => this.loadModule())
        .catch(err => {
            throw new Error('Unable to import XML');
        });
    }
    XmlCtrl.prototype.loadModule=function(){
        // need to load corres. module here.
        const { rSalesOrder }=require('./../modules/rsalesorder');
        var so=new rSalesOrder();
        so.setDb(this.getDb());
        return so.import();
    }
    XmlCtrl.prototype.saveXml=function(){
        // need to save xml file to the server file system.
        return Promise.resolve(true);
    }
    return XmlCtrl;
})();
module.exports=exports=XmlCtrl;
