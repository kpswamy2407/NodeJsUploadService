const { Base, BaseError, BaseCollection }=require('./../core');
const { __extends }=require('tslib');
console.log(BaseError);
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
    XmlCtrl.prototype.crmIncrement=async function(){
        try{
            var dbConn=this.getDb();
            const CrmEntitySeq=dbConn.import('./../models/crmentityseq');
            var seq=CrmEntitySeq.fnxtIncrement();
            console.log(seq);
            /*await this.updateIncrement(seq);*/
            return true;
        }catch(e){
            console.log(e.error);
        }
    }
    XmlCtrl.prototype.updateIncrement=async function(id){
        var dbConn=this.getDb();
            const CrmEntitySeq=dbConn.import('./../models/crmentityseq');
        CrmEntitySeq.update(
                {id: id+1},
                {where: {id:id}}
            ).then().catch(e=>{
                console.log(e);
            });
    }
    XmlCtrl.prototype.import=function(){
        try{

            var collc=new BaseCollection(this.xmljs);
            console.log("hello");
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
            return this.saveXml(name).then(() => modl.import(this.xmlstr));
            
        }catch(e){
            console.log(e);
        }
    }
    return XmlCtrl;
})();
module.exports=exports=XmlCtrl;
