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
        const convertor=require('xml-js');
        var xmljs = convertor.xml2js(xmlstr, {compact: true, spaces: 4});
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
        /*var collc=new SalesCollection()
        collc.documenttype()
        */return this.saveXml()
        .then(() => this.loadModule())
        .catch(err => {
            throw new Error('Unable to import XML');
        });
    }
    XmlCtrl.prototype.loadModule=function(){
        // need to load corres. module here.
        
      const { rSalesOrder }=require('./../modules/rsalesorder');
                           var so=new rSalesOrder(xmljs);
                           so.setDb(this.getDb());
                           return so.import();
    }
    XmlCtrl.prototype.saveXml=function(){
        // need to save xml file to the server file system.
       
        const DmsProcessXmlStatus=require('../models/dmsprocessxmlstatus');
       
        return Promise.resolve(true);
    }
    return XmlCtrl;
})();
module.exports=exports=XmlCtrl;
