const { BaseModule }=require('../../core');
const { __extends }=require('tslib');
const CollecReader=require('./collec-reader');

/**
 * 
 * @see 
 * @since Tue October 01, 2019 05:24 PM.
 * @author nandha.viswanathan@sifycorp.com 
 */
var rSalesOrder=(function(){
    __extends(rSalesOrder,BaseModule);
    function rSalesOrder(xmljs){
        BaseModule.call(this,xmljs);
    };
    rSalesOrder.prototype.importAssoc=function(){
        const dbconn=this.getDb();
        const CrmEntity=dbconn.import('./../../models/crmentity');
        const rSalesOrder=dbconn.import('./../../models/rsalesorder');
        const rSalesOrderCf=dbconn.import('./../../models/rsalesorder-cf');
        const rSoProductRel=dbconn.import('./../../models/rso-productrel');
        const VtigerTab=dbconn.import('./../../models/vtiger-tab');
        const VtigerField=dbconn.import('./../../models/vtiger-field');
        const CurrencyInfo=dbconn.import('./../../models/currency-info');
        const RelModule=dbconn.import('./../../models/rel-module');
        const Retailer=dbconn.import('./../../models/retailer');
        const SubRetailer=dbconn.import('./../../models/sub-retailer');
        const RecCustMaster=dbconn.import('./../../models/rec-cust-mas');
        rSalesOrder.belongsTo(CrmEntity,{
            as:'Crm',
            foreignKey:'salesorderid',
            targetKey:'crmid',
        });
        rSalesOrder.hasOne(rSalesOrderCf,{
            foreignKey:'salesorderid',
            sourceKey:'salesorderid',
            as:'Cf'
        });
        rSalesOrder.hasMany(rSoProductRel,{
            foreignKey:'id',
            sourceKey:'salesorderid',
            as:'Rel'
        });
        this.models['CrmEntity']=CrmEntity;
        this.models['rSalesOrder']=rSalesOrder;
        this.models['rSalesOrderCf']=rSalesOrderCf;
        this.models['rSoProductRel']=rSoProductRel;
        this.models['VtigerField']=VtigerField;
        this.models['VtigerTab']=VtigerTab;
        this.models['CurrencyInfo']=CurrencyInfo;
        this.models['RelModule']=RelModule;
        this.models['Retailer']=Retailer;
        this.models['SubRetailer']=SubRetailer;
        this.models['RecCustMaster']=RecCustMaster;
        return this;
    };
    rSalesOrder.prototype.import=async function(xml){
        try{
            this.importAssoc();
            var crdr=new CollecReader(this._xmljs);
            var rSalesOrder=this.models['rSalesOrder'];
            var VtigerField=this.models['VtigerField'];
            var VtigerTab=this.models['VtigerTab'];
            var CurrencyInfo=this.models['CurrencyInfo'];
            var RelModule=this.models['RelModule'];
            var Retailer=this.models['Retailer'];
            var SubRetailer=this.models['SubRetailer'];
            var RecCustMaster=this.models['RecCustMaster'];
            var fields=await this.getFields();
            var baseColl=await crdr.xrso();
            if(Object.getPrototypeOf( baseColl ) === Object.prototype){
                var baseColls=[baseColl];
            }
            else{
                var baseColls=baseColl;
            }
            baseColls.forEach(coll=>{
                var rso=new rSalesOrder();
                
                 fields.forEach(async function(field){
                     switch(field.uitype){
                         case 117:
                        await CurrencyInfo.findOne({
                                 where:{currency_code:coll.currency_id.currency_code._text},
                                 }).then(currency=>{
                                     rso[field.columnname]=currency.id;
                                 }).catch(e=>{
                                     throw new Error('Unable to get the currency id for sales order');
                                 });
                         break;
                         case 10:
                            await RelModule.findOne({
                                 where:{fieldid:field.fieldid},
                                 attributes:['relmodule']
                             }).then(rel=>{
                                 var relModule=rel.relmodule;
                                 //default related module for buyerid is xRetailer
                                 if(field.columnname=='buyerid'){
                                     var customerType=coll.customer_type._text;
                                     switch(customerType){
                                        case 1:
                                            RecCustMaster.findOne({
                                                where:{customercode:coll.buyerid.customercode._text,deleted:0},
                                                attributes:['xreceivecustomermasterid']
                                            }).then(retailer=>{
                                                if(retailer){
                                                    rso[field.columnname]=retailer.xreceivecustomermasterid;
                                                }
                                                else{
                                                    throw new Error('No customer master found with provided customercode');
                                                }
                                            }).catch(e=>{
                                                throw new Error('Unable to get customer master details');
                                            });
                                        break;
                                        case 2:
                                            SubRetailer.findOne({
                                                where:{customercode:coll.buyerid.customercode._text,deleted:0},
                                                attributes:['xsubretailerid']
                                            }).then(retailer=>{
                                                if(retailer){
                                                    rso[field.columnname]=retailer.xsubretailerid;
                                                }
                                                else{
                                                    throw new Error('No sub-retailer found with provided customercode');
                                                }
                                            }).catch(e=>{
                                                throw new Error('Unable to get sub-retailer details');
                                            });
                                        break;
                                        default
                                            Retailer.findOne({
                                                where:{customercode:coll.buyerid.customercode._text,deleted:0},
                                                attributes:['xretailerid']
                                            }).then(retailer=>{
                                                if(retailer){
                                                    rso[field.columnname]=retailer.xretailerid;
                                                }
                                                else{
                                                    throw new Error('No Retailer found with provided customercode');
                                                }
                                            }).catch(e=>{
                                                throw new Error('Unable to get retailer details');
                                            });
                                        } 
                                 }
                             }).catch(e=>{
                                 throw new Error('unable to get the related module');
                             });
                             
                         default:
                         //console.log(field.columnname,'=>',coll[field.columnname]);
                         if(field.columnname!='crmid'){
                             
                             rso[field.columnname]=coll[field.columnname]._text;
                         }
                     }
                     return rso; 
                 });
                 console.log('======================');
                 console.log(rso.next_stage_name);
                 console.log('======================');

                rso.save().then(res=>{console.log(res)}).catch(e=>{
                    console.log(e);
                });
            });
        }
        catch(e){
            return  Promise.reject(e.error);
        }
        return Promise.resolve(true);
        //

        
        //rso.lbl_rso_save_pro_cate=false;
        
       // rso.save();
      /* rSalesOrder.create({}).then(ress=>{
        console.log(res);
       }).catch(e=>{
        console.log(e);
       });*/
       
        //

        /*rso.save()

        var p$=rSalesOrder.findOne()
        // get mapped crmentity using sequelize belongsTo association
        p$.then(rso => {
            console.log(rso.dataValues);
            return rso.getCrm();
        })
        .then(crme => {
            console.log(crme.dataValues);
        });
        // get mapped productrel using sequelize hasMany association
        p$.then(rso => {
            return rso.getRel();
        })
        .then(rels =>{
            rels.forEach(rel => console.log(rel.dataValues));
        });
        // get mapped cf table using sequelize hasOne association
        p$.then(rso => {
            return rso.getCf();
        })
        .then(rsocf => console.log(rsocf.dataValues));
        // use custom collection reader to read xml js 
        var crdr=new CollecReader(this._xmljs);
        crdr.lineItems();*/
        return this.saveXml(xml);
    };
    rSalesOrder.prototype.getFields=async function (){
        const dbconn=this.getDb();
        const VtigerField=dbconn.import('./../../models/vtiger-field');
        const rSalesOrder=dbconn.import('./../../models/rsalesorder');
        const VtigerTab=dbconn.import('./../../models/vtiger-tab')

        return VtigerField.findAll({
                where:{
                    tablename:[rSalesOrder.tableName,rSalesOrder.tableName+'cf'],xmlreceivetable:1},
                attributes: ['fieldid','columnname','typeofdata','uitype','tabid'],
                include:[{model:VtigerTab,required:true,attributes:['tabid','name']}],
                }).then(fields => {
                    return fields;
                }).catch(e=>{
                    console.log(e);
                    return e.error;
                });
    }
    return rSalesOrder;
})();
module.exports=exports=rSalesOrder;
