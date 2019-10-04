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
       return this.saveXml()
        .then(() => this.loadModule())
        .catch(err => {
            throw new Error('Unable to import XML');
        });
    }
    XmlCtrl.prototype.loadModule=function(){
        // need to load corres. module here.
        
     try{
        const { rSalesOrder }=require('./../modules/rsalesorder');
                             var so=new rSalesOrder(this.xmljs);
                             so.setDb(this.getDb());
                             return so.import(this.xmlstr);
     }
     catch(e){
        console.log(e);
     }
    }
    XmlCtrl.prototype.saveXml=function(){
        // need to save xml file to the server file system.
      /* var service='xSalesOrder';
        const DmsProcessXmlStatus=require('../models/dmsprocessxmlstatus');
        DmsProcessXmlStatus.create({
            service_name:service,
            context:this.xmlstr,
            status:0
        }).then()*/
       
        return Promise.resolve(true);
    }
    return XmlCtrl;
})();
module.exports=exports=XmlCtrl;
