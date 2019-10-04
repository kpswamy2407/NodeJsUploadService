const { Base, BaseCollection }=require('./../core');
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
        var xmljs = require('xml-js').xml2js(xmlstr, {compact: true, spaces: 4});
        Object.defineProperty(this,'xmlstr',{
            value:xmlstr,
            configurable:false,
            writable:false,
            enumerable:true,
        });
        Object.defineProperty(this,'xmljs',{
            value:xmljs,
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
        var collc=new BaseCollection(this.xmljs);
            switch(collc.documentType()){
             case 'xrSalesOrder':
                    var { rSalesOrder: Module}=require('./../modules/rsalesorder');
                break;
                default:
                    throw new Error('Trying to load Invalid module.');
            break;
        };
        var modl=new Module(this.xmljs);
        modl.setDb(this.getDb());
        return modl.import();
    }
   
    XmlCtrl.prototype.saveXml=function(){
        return Promise.resolve(true);
    }
    return XmlCtrl;
})();
module.exports=exports=XmlCtrl;
