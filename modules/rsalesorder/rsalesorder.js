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
 		const CrmEntitySeq=dbconn.import('./../../models/crmentityseq');
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
 		const Beat=dbconn.import('./../../models/beat');
 		const Salesman=dbconn.import('./../../models/salesman');
 		const XSeries=dbconn.import('./../../models/x-series');

 		console.log(CrmEntitySeq);
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
 		this.models['Salesman']=Salesman;
 		this.models['Beat']=Beat;
 		this.models['XSeries']=XSeries;
 		this.models['CrmEntitySeq']=CrmEntitySeq;
 		return this;
 	};
 	rSalesOrder.prototype.import=async function(xml){
 		try{
 			this.importAssoc();
 			var dbconn=this.getDb();
 			var crdr=new CollecReader(this._xmljs);
 			var rSalesOrder=this.models['rSalesOrder'];
 			var rSalesOrderCf=this.models['rSalesOrderCf'];
 			var VtigerField=this.models['VtigerField'];
 			var VtigerTab=this.models['VtigerTab'];
 			var CurrencyInfo=this.models['CurrencyInfo'];
 			var RelModule=this.models['RelModule'];
 			var Retailer=this.models['Retailer'];
 			var SubRetailer=this.models['SubRetailer'];
 			var RecCustMaster=this.models['RecCustMaster'];
 			var Beat=this.models['Beat'];
 			var Salesman=this.models['Salesman'];
 			var XSeries=this.models['XSeries'];
 			var fields=await this.getFields();
 			var baseColl=await crdr.xrso();
 			var self=this;
 			if(Object.getPrototypeOf( baseColl ) === Object.prototype){
 				var baseColls=[baseColl];
 			}
 			else{
 				var baseColls=baseColl;
 			}
 			baseColls.forEach(async function(coll){
 				const {rso, rsocf} = await self.prepareValues(coll,fields);
 				
 				dbconn.transaction().then(t => {
 				  return rso.save({transaction: t}).then(so => {
 				    return rsocf.save({transaction:t}).then(socf=>{
 				    		return self.updateLineItems(so,t,coll.lineitems);
 				    });
 				  }).then(() => {
 				    return t.commit();
 				  }).catch((err) => {
 				    return t.rollback();
 				  });
 				});
 			});
 		}
 		catch(e){
 			console.log(e);
 			return  Promise.reject(e.error);
 		}
 		return Promise.resolve(true);

 		return this.saveXml(xml);
 	};
 	rSalesOrder.prototype.prepareValues=async function(coll,fields){
 		var self=this;
 		var dbconn=this.getDb();
 		const rSalesOrder=dbconn.import('./../../models/rsalesorder');
 		const rSalesOrderCf=dbconn.import('./../../models/rsalesorder-cf');
 		const CurrencyInfo=dbconn.import('./../../models/currency-info');
 		var rso=new rSalesOrder();
 		var rsocf=new rSalesOrderCf();
 		var salesorderid=await self.getCrmEntity();

 		rso.salesorderid=salesorderid;
 		rsocf.salesorderid=salesorderid;
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
 					

 					 //default related module for buyerid is xRetailer
 						switch(field.columnname){
 					   	case 'buyerid':

 					               	var buyerid=await self.getBuyerId(coll.customer_type._text,coll);
 					               	rso[field.columnname]=buyerid;
 					               	rsocf[field.columnname]=buyerid; 

 					               	break;

 					               	case 'cf_xrso_beat':
 					               	var beatId=await self.getBeat(coll);
 					               	rso[field.columnname]=beatId;
 					               	rsocf[field.columnname]=beatId; 

 					               	break;
 					               	case 'cf_xrso_sales_man':
 					               	rso[field.columnname]= coll.cf_xrso_sales_man.salesmanid._text;
 					               	rsocf[field.columnname]= coll.cf_xrso_sales_man.salesmanid._text;

 					               	break;
 					               	case 'cf_salesorder_transaction_series':
 					               	var transSeries=await self.getTransactionSeries(coll);  
 					               	rso[field.columnname]= transSeries;
 					               	rsocf[field.columnname]=transSeries;
 					               	break;
 					               }
 					
 					

 		      default:
 		                         //console.log(field.columnname,'=>',coll[field.columnname]);
 		                         if(field.columnname!='crmid' && field.columnname!='cf_xrso_type'){

 		                         	if(coll[field.columnname]!=='undefined' &&coll[field.columnname]!==null && Object.keys(coll[field.columnname]).length>0){
 		                         		rso[field.columnname]= coll[field.columnname]._text;
 		                         		rsocf[field.columnname]= coll[field.columnname]._text;
 		                         	} 
 		                         }
 		                      }
 		         
 		     });

 		return {rso:rso,rsocf: rsocf}; 
 	}

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
 				return e.error;
 			});
 	}
 	rSalesOrder.prototype.getTransGridFields=async function (tableName){
 		const dbconn=this.getDb();
 		const XGridField=dbconn.import('./../../models/x-grid-field');
 		
 		return XGridField.findAll({
 			where:{
 				tablename:tableName,xmlreceivetable:1},
 				attributes: ['columnname'],
 				
 			}).then(fields => {
 				return fields;
 			}).catch(e=>{
 				console.log("grid=>>",e);
 				return e.error;
 			});
 	}
 	rSalesOrder.prototype.getTransRel=async function(){
 			const dbconn=this.getDb();
 			const TransRel=dbconn.import('./../../models/trans-rel');
 			return TransRel.findOne({
 				where:{'transaction_name':'xrSalesOrder'},
 				attributes:['transaction_rel_table','profirldname','relid','uom','categoryid','receive_pro_by_cate']
 			}).then(relation=>{
 				return relation;
 			}).catch(e=>{
 				console.log(e);
 				throw new Error("Unable to get the tranaction related information");
 			});
 		}

 	rSalesOrder.prototype.getBeat=async function(coll){
 			var dbconn=this.getDb();
 			const Beat=dbconn.import('./../../models/beat');
 			return Beat.findOne({
 				where:{beatcode:coll.cf_xrso_beat.beatcode._text,deleted:0},
 				attributes:['xbeatid']
 			}).then(beat=>{
 				if(beat){
 					return beat.xbeatid;
 				}
 				else{
 					throw new Error('No next_stage_name found with provided customercode');
 				}

 			}).catch(e=>{
 				throw new Error('Unable to get the beat value');
 			});
 	}
 	rSalesOrder.prototype.getTransactionSeries=async function(coll){
 			var dbconn=this.getDb();
 			const XSeries=dbconn.import('./../../models/x-series');
 			return XSeries.findOne({
 				where:{transactionseriescode:coll.cf_salesorder_transaction_series.transactionseriesname._text,deleted:0},
 				attributes:['xtransactionseriesid']
 			}).then(series=>{
 				if(series){
 					return series.xtransactionseriesid;
 				}
 				else{
 					return '';

 				}

 			}).catch(e=>{
 				return '';

 			});
 	}
 	
	rSalesOrder.prototype.getBuyerId=async function(customerType,coll){
 		var dbconn=this.getDb();
 		const Retailer=dbconn.import('./../../models/retailer');
 		const SubRetailer=dbconn.import('./../../models/sub-retailer');
 		const RecCustMaster=dbconn.import('./../../models/rec-cust-mas');

 		switch(customerType){
 			case 1:
 				return  RecCustMaster.findOne({
 					where:{customercode:coll.buyerid.customercode._text,deleted:0},
 					attributes:['xreceivecustomermasterid']
 				}).then(retailer=>{
 					if(retailer){
 						return retailer.xreceivecustomermasterid;
 					}
 					else{
 						throw new Error('No customer master found with provided customercode');
 					}
 				}).catch(e=>{
 					throw new Error('Unable to get customer master details');
 				});
 				break;
 				case 2:
 				await SubRetailer.findOne({
 					where:{customercode:coll.buyerid.customercode._text,deleted:0},
 					attributes:['xsubretailerid']
 				}).then(retailer=>{
 					if(retailer){
 						return retailer.xsubretailerid;
 					}
 					else{
 						throw new Error('No sub-retailer found with provided customercode');
 					}
 				}).catch(e=>{
 					throw new Error('Unable to get sub-retailer details');
 				});
 				break;
 				default:
 				return Retailer.findOne({
 					where:{customercode:coll.buyerid.customercode._text,deleted:0},
 					attributes:['xretailerid']
 				}).then(retailer=>{
 					if(retailer){
 						return retailer.xretailerid;
 					}
 					else{
 						throw new Error('No Retailer found with provided customercode');
 					}
 				}).catch(e=>{
 					throw new Error('Unable to get retailer details');
 			});
 		}
 	}
 	
 	rSalesOrder.prototype.updateLineItems=async function(so,t,coll){
 		var self=this;
 		var dbconn=this.getDb();
 		const XsroProdRel=dbconn.import('./../../models/xrso-prod-rel');
 		var transRel=await self.getTransRel();
 		var transGridFields=await self.getTransGridFields(transRel.transaction_rel_table);
 		var lineItems=coll[transRel.transaction_rel_table];
 		lineItems.forEach(async function(lineItem){
 			var xsroProdRel=new XsroProdRel();
 			transGridFields.forEach(async function(field){
 				switch(field.columnname){
 					case transRel.relid :
 						xsroProdRel[transRel.relid]=so.salesorderid;
 					break;
 					case transRel.categoryid :
 					
 					break;

 				}
 			});
 			console.log(lineItem);
 		});
 		return Promise.reject(true);
 	}
 	rSalesOrder.prototype.getCrmEntity=async function(){
 		const dbconn=this.getDb();
 		const CrmEntity=dbconn.import('./../../models/crmentity');
 		const CrmEntitySeq=dbconn.import('./../../models/crmentityseq');
 		const VtigerTab=dbconn.import('./../../models/vtiger-tab');
 		return Promise.all([VtigerTab.getTab('xrSalesOrder'),CrmEntitySeq.fnxtIncrement()]).then(res=>{
 			var [tab,id]=res;
 			var rsocrm=new CrmEntity({
 				crmid:id,
 				smcreatorid:1,
 				smownerid:1,
 				modifiedby:0,
 				setype:tab.name,
 				setype_id:tab.tabid,
 				description:null,
 				createdtime:new Date(),
 				modifiedtime:new Date(),
 				viewedtime:null,
 				status:null,
 				version:0,
 				presence:1,
 				deleted:0,
 				sendstatus:null,
 				terms_conditions:null,
 			});
 				return rsocrm.save().then(crm=>{
 					return crm.crmid;
 				}).catch(e=>{
 					throw new Error('Unable to create CRM entity for rSalesOrder.');
 				});
 			}).catch(e=>{
 			throw new Error('Unable to create CRM entity f or rSalesOrder');
 		});

 	}
 	return rSalesOrder;
})();
module.exports=exports=rSalesOrder;
