const { Base, BaseError, BaseCollection }=require('./../core');
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
    XmlCtrl.SAVE_XML_TO_FS=true;
    XmlCtrl.prototype.saveXml=function(modl){
        if(XmlCtrl.SAVE_XML_TO_FS){
            const XmlFile=require('./../utils/xml-file');
            const moment=require('moment')();
            var xmlf=new XmlFile();
            xmlf.setLog(this.getLog());
            xmlf.basedir='./public/uploads';
            xmlf.module=modl;
            xmlf.content=this.xmlstr;
            xmlf.fileName=moment.format('YYYYMMDDHHmmss.SSS');
            xmlf.date=moment.format('YYYY-MM-DD');
            return xmlf.save();
        }
        return Promise.resolve(true);
    }
    XmlCtrl.prototype.import=function(){
        var collc=new BaseCollection(this.xmljs);
        var name=collc.documentType();
        switch(name){
             case 'xrSalesOrder':
                var { rSalesOrder: Module}=require('./../modules/rsalesorder');
            break;
            default:
                throw new BaseError('Trying to load Invalid module.');
            break;
        };
        var modl=new Module(this.xmljs);
        modl.setDb(this.getDb());
        modl.setLog(this.getLog());
        return this.saveXml(name).then(() => modl.import());
    }
    return XmlCtrl;
})();
module.exports=exports=XmlCtrl;
