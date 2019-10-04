const Base =require('./base');
const BaseError=require('./base-error');
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
        var __stat=null;
        this.setStatus=function(stat){
            __stat=stat;
        };
        this.getStatus=function(){
            if(__stat==null || __stat==undefined){
                throw new BaseError('XML status model has NOT been set.');
            }
            return __stat;
        };
    }
    BaseModule.prototype.saveXml=function(xml){
        const dbconn=this.getDb();
        const serviceName=this.constructor.name;
        const XmlStat=dbconn.import('../models/xmlstatus');
        return XmlStat.create({
            service_name:serviceName,
            status:0,
            context:xml,
        })
        .then(model => {
            this.setStatus(model);
            return true;
        })
        .catch(e => {throw new BaseError('Unable to save XML status.')});
    }
    return BaseModule;
})();
module.exports=exports=BaseModule;
