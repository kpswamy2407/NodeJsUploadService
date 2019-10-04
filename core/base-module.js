const Base =require('./base');
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
    	console.log(this.__xmljs);
    };
    BaseModule.prototype.saveXml=function(xml){
        const serviceName=this.constructor.name;
        const dbconn=this.getDb();
        const DmsProcessXmlStatus=dbconn.import('../models/dmsprocessxmlstatus');
        DmsProcessXmlStatus.create({
            service_name:serviceName,
            status:0,
            context:xml,
        }).then(dmsproces=>{
            console.log(dmsproces.id);
        }).catch(e=>{
            console.log(e);
        });

    }
    BaseModule.prototype.setProcessId=function(id){

    }
    BaseModule.prototype.getProcessId=function(){

    }

    return BaseModule;
})();
module.exports=exports=BaseModule;
