const Base =require('./base');
const BaseError=require('./base-error');
const { __extends }=require('tslib');
var moment = require('moment');
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
    BaseModule.prototype.models={};
    BaseModule.prototype.saveXml=function(xml,serviceName){
        const dbconn=this.getDb();
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
        .catch(err => {
            this.fatal(err.message);
            throw new BaseError('Error while saving XML to the db.');
        });
    }
    BaseModule.prototype.updateStatus=function(failure){
        var status=this.getStatus();
        if(failure){
            status.status=2;
            status.end_time=moment().format('YYYY-MM-DD HH:mm:ss');
            status.save();
            return true;
        }
        else{
            status.status=1;
            status.end_time=moment().format('YYYY-MM-DD HH:mm:ss');
            status.save();
            return true;
        }
    }
    return BaseModule;
})();
module.exports=exports=BaseModule;
