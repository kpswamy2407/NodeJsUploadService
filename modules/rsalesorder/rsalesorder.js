const { BaseModule }=require('../../core');
const { __extends }=require('tslib');
const CollecReader=require('./collec-reader');
const Audit=require('../../utils/audit');
var Sequelize = require("sequelize");
var moment = require('moment');
const Op = Sequelize.Op

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
 	rSalesOrder.prototype.isFailure=false;
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
 			this.saveXml(xml,'xrSalesOrder');
 			this.setLogFileName('app_sql_xrSalesOrder_'+moment().format('YYYY-MM-DD-HH-mm-ss.SSS')+'.txt');
 			this.importAssoc();
 			var dbconn=this.getDb();
 			var crdr=new CollecReader(this._xmljs);
 			var audit=new Audit();
 				audit.docName=crdr.transactionId();
 				audit.distCode=crdr.fromId();
 				audit.options="Receive";
 				audit.source=crdr.sourceApplication();
 				audit.docCreatedDate=crdr.createdDate();
 				audit.destination=crdr.destApplication();
 				audit.docType=crdr.docType();
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
 			await baseColls.reduce(async (promise, coll) => {
 				await promise;
 				const {rso, rsocf} = await self.prepareValues(coll,fields,audit);
 				await dbconn.transaction().then(async (t) => {
 				  return await rso.save({transaction: t}).then(async (so) => {
 				    return await rsocf.save({transaction:t}).then(async (socf)=>{
 				    	if(t.commit()){
 				    			await self.save(socf.salesorderid);
 				    			await self.updateLineItems(so,audit,coll.lineitems)
 				    	}
 				    });
 				  }).then(async (t) => {
 				    
 				  }).catch(async (err) => {
 				  		audit.statusCode='FN2010';
	 					audit.statusMsg=err.message;
	 					audit.reason=err.message;
	 					audit.status='Failed';
	 					audit.subject=rso.subject;
	 					audit.saveLog(dbconn);
	 					self.isFailure=true;
 				    	return await t.rollback();
 					});
 				});
 			
 			}, Promise.resolve());
 			
 		}
 		catch(e){
 			return  Promise.reject(e.error);
 		}
 		return Promise.resolve(this.updateStatus(self.isFailure));

 	};
 	rSalesOrder.prototype.prepareValues=async function(coll,fields,audit){
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
 		await fields.reduce(async (promise, field) => {
 		    await promise;
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
 			 			if(buyerid){
 			 				rso[field.columnname]=buyerid;
 			 				rsocf[field.columnname]=buyerid;
 			 			}
 			 			else{
 			 				audit.statusCode='FN8200';
 				 			audit.statusMsg="Due to Invalid data, we are unable to get the buyer id";
 				 			audit.reason="Error while getting the related module data";
 				 			audit.status='Failed';
 							audit.subject=coll.subject._text;
 							audit.saveLog(dbconn);
 							self.isFailure=true;
 			 			}
 			 			break;

 			 			case 'cf_xrso_beat':
 			 				var beatId=await self.getBeat(coll);
 			 					if(beatId){
 			 						rso[field.columnname]=beatId;
 			 					    rsocf[field.columnname]=beatId;
 			 					}
 			 					else{
 			 						audit.statusCode='FN8216';
 				 					audit.statusMsg="Invalid Beat";
 				 					audit.reason="Error while getting the related module data";
 				 					audit.status='Failed';
 								 	audit.subject=coll.subject._text;
 								 	audit.saveLog(dbconn);
 								 	self.isFailure=true;
 			 					 }
 			 			break;
 			 			case 'cf_xrso_sales_man':
 			 				try{
 								rso[field.columnname]= coll.cf_xrso_sales_man.salesmanid._text;
 			 					rsocf[field.columnname]= coll.cf_xrso_sales_man.salesmanid._text;
 			 				}
 			 				catch(e){
 								audit.statusCode='FN8210';
 				 				audit.statusMsg="Invalid Salesman code";
 				 				audit.reason="Error while getting the related module data";
 				 				audit.status='Failed';
 								audit.subject=coll.subject._text;
 								audit.saveLog(dbconn);
 								self.isFailure=true;
 			 				}
 			 					               	
			            break;
			            case 'cf_salesorder_transaction_series':
			            	var transSeries=await self.getTransactionSeries(coll);  
			            	rso[field.columnname]= transSeries;
			               	rsocf[field.columnname]=transSeries;
			            break;
			               
			        }
					break;
	 		      	default:
	 		                         //console.log(field.columnname,'=>',coll[field.columnname]);
	 		            if(field.typeofdata.includes('M')){
	 		            	if(coll[field.columnname]!=='undefined' &&coll[field.columnname]!==null && Object.keys(coll[field.columnname]).length>0){
	 		            		rso[field.columnname]= coll[field.columnname]._text;
	 		            	    rsocf[field.columnname]= coll[field.columnname]._text;
	 		            	 }
	 		            	 else{
	 		            	 	audit.statusCode='FN8210';
 				 				audit.statusMsg=field.columnname+" is required";
 				 				audit.reason=field.columnname+" is required";
 				 				audit.status='Failed';
 								audit.subject=coll.subject._text;
 								audit.saveLog(dbconn);
 								self.isFailure=true;
	 		            	 } 
	 		            }
	 		            else{
	 		            	if(field.columnname!='crmid' && field.columnname!='cf_xrso_type'){

	 		            	    if(coll[field.columnname]!=='undefined' &&coll[field.columnname]!==null && Object.keys(coll[field.columnname]).length>0){
	 		            	    	rso[field.columnname]= coll[field.columnname]._text;
	 		            	        rsocf[field.columnname]= coll[field.columnname]._text;
	 		            	     } 
	 		            	}
	 		            }
	 		            if(field.columnname!='crmid' && field.columnname!='cf_xrso_type'){

	 		                if(coll[field.columnname]!=='undefined' &&coll[field.columnname]!==null && Object.keys(coll[field.columnname]).length>0){
	 		                	rso[field.columnname]= coll[field.columnname]._text;
	 		                    rsocf[field.columnname]= coll[field.columnname]._text;
	 		                   } 
	 		            }
	 		         break;
	 		    }
	 		         
 			 		     
 		  
 		}, Promise.resolve());
 		
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
 					return false;
 				}

 			}).catch(e=>{
 				return false;
 			});
 	}
 	rSalesOrder.prototype.getInvMgtConfig=async function(key){
 			var dbconn=this.getDb();
 			const InvMgtConfig=dbconn.import('./../../models/inv-mgt-config');
 			return InvMgtConfig.findOne({
 				where:{key:key,treatment:'sap'},
 				attributes:['value']
 			}).then(config=>{
 				if(config){
 					return config.value;
 				}
 				else{
 					throw new Error('Unable to get the inv mgt config for '+key);
 				}

 			}).catch(e=>{
 				throw new Error('Unable to get the inv mgt config for '+key);
 			});
 	}
 	rSalesOrder.prototype.getProductId=async function(productCode){
 			var dbconn=this.getDb();
 			const Product=dbconn.import('./../../models/product');
 			return Product.findOne({
 				where:{productcode:productCode},
 				attributes:['xproductid']
 			}).then(product=>{
 				if(product){
 					return product.xproductid;
 				}
 				else{
 					return false;
 				}

 			}).catch(e=>{
 				return false;
 			});
 	}
 	rSalesOrder.prototype.getUomId=async function(uomName){
 			var dbconn=this.getDb();
 			const Uom=dbconn.import('./../../models/uom');
 			return Uom.findOne({
 				where:{uomname:uomName},
 				attributes:['uomid']
 			}).then(uom=>{
 				if(uom){
 					return uom.uomid;
 				}
 				else{
 					return false;
 				}

 			}).catch(e=>{
 				return false;
 			});
 	}
 	rSalesOrder.prototype.trash=function(soId){
 			var dbconn=this.getDb();
 			const CrmEntity=dbconn.import('./../../models/crmentity');
 			const rSalesOrder=dbconn.import('./../../models/rsalesorder');
 			const rSalesOrderCf=dbconn.import('./../../models/rsalesorder-cf');
 			const XrsoProdRel=dbconn.import('./../../models/xrso-prod-rel');
 			CrmEntity.update(
 				{modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),deleted:1},
 				{where: {crmid:soId}}
 			).then().catch();
 			rSalesOrder.update(
 				{modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),deleted:1},
 				{where: {salesorderid:soId}}
 			).then().catch();
 			rSalesOrderCf.update(
 				{modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),deleted:1},
 				{where: {salesorderid:soId}}
 			).then().catch();

 			XrsoProdRel.update(
 				{modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),deleted:1},
 				{where: {id:soId}}
 			).then().catch();
 			
 					
 	}
 	rSalesOrder.prototype.save=function(soId){
 			var dbconn=this.getDb();
 			const CrmEntity=dbconn.import('./../../models/crmentity');
 			const rSalesOrder=dbconn.import('./../../models/rsalesorder');
 			const rSalesOrderCf=dbconn.import('./../../models/rsalesorder-cf');
 			const XrsoProdRel=dbconn.import('./../../models/xrso-prod-rel');
 			CrmEntity.update(
 				{
 					modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),
 					created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
 					deleted:0},
 				{where: 
 					{crmid:soId}}
 			).then().catch();
 			rSalesOrder.update(
 				{
 					modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),
 					created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
 					deleted:0},
 				{where: {salesorderid:soId}}
 			).then().catch();
 			rSalesOrderCf.update(
 				{
 					modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),
 					created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
 					deleted:0},
 				{where: {salesorderid:soId}}
 			).then().catch();

 			XrsoProdRel.update(
 				{modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),deleted:1},
 				{where: {id:soId}}
 			).then().catch();		
 	}
 	rSalesOrder.prototype.updateSubject= function(soId,subject){
 		var dbconn=this.getDb();
 		const rSalesOrder=dbconn.import('./../../models/rsalesorder');
 		rSalesOrder.update(
 				{
 					subject:subject
 				},
 				{where: {salesorderid:soId}}
 			).then().catch();
 		
 	}
 	rSalesOrder.prototype.update=function(soId){
 			var dbconn=this.getDb();
 			const CrmEntity=dbconn.import('./../../models/crmentity');
 			const rSalesOrder=dbconn.import('./../../models/rsalesorder');
 			const rSalesOrderCf=dbconn.import('./../../models/rsalesorder-cf');
 			const XrsoProdRel=dbconn.import('./../../models/xrso-prod-rel');
 			CrmEntity.update(
 				{
 					modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),
 					deleted:0},
 				{where: 
 					{crmid:soId}}
 			).then().catch();
 			rSalesOrder.update(
 				{
 					modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),
 					deleted:0},
 				{where: {salesorderid:soId}}
 			).then().catch();
 			rSalesOrderCf.update(
 				{
 					modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),
 					deleted:0},
 				{where: {salesorderid:soId}}
 			).then().catch();

 			XrsoProdRel.update(
 				{modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),deleted:1},
 				{where: {id:soId}}
 			).then().catch();		
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
 						return false;
 					}
 				}).catch(e=>{
 					return false;
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
 						return false;
 					}
 				}).catch(e=>{
 					return false;
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
 						return false;
 					}
 				}).catch(e=>{
 					return false;
 			});
 		}
 	}
 	
 	rSalesOrder.prototype.updateLineItems=async function(so,audit,coll){
 		
 				
 					
 			 		var self=this;
 			 		var dbconn=this.getDb();
 			 		const XrsoProdRel=dbconn.import('./../../models/xrso-prod-rel');
 			 		var transRel=await self.getTransRel();
 			 		var transGridFields=await self.getTransGridFields(transRel.transaction_rel_table);
 			 		if(Object.getPrototypeOf( coll[transRel.transaction_rel_table]) === Object.prototype){
 			 			
 			 			var lineItems=[coll[transRel.transaction_rel_table]]
 			 		}
 			 		else{
 			 			var lineItems=coll[transRel.transaction_rel_table];
 			 		}
 			 		
 			 		var LBL_RSO_SAVE_PRO_CATE= await self.getInvMgtConfig('LBL_RSO_SAVE_PRO_CATE');
 			 		var LBL_VALIDATE_RPI_PROD_CODE= await self.getInvMgtConfig('LBL_VALIDATE_RPI_PROD_CODE');
 			 		var is_process=((LBL_RSO_SAVE_PRO_CATE.toLowerCase()=='true' && transRel.receive_pro_by_cate.toLowerCase()=='true'))?0:1;
 			 		
 			 		lineItemsIteration:
 			 		for (var i = 0; i < lineItems.length; i++) {
 			 			
 			 			var lineItem=lineItems[i];
 			 			transGridFieldsIteration:
 			 			var xrsoProdRel=new XrsoProdRel();
 			 			xrsoProdRel['created_at']=moment().format('YYYY-MM-DD HH:mm:ss');
 			 			xrsoProdRel['modified_at']=moment().format('YYYY-MM-DD HH:mm:ss');

 			 			for (var j = 0; j < transGridFields.length; j++) {
 			 				var field=transGridFields[j];

 			 				switch(field.columnname){
 			 					case transRel.relid :
 			 						xrsoProdRel[transRel.relid]=so.salesorderid;
 			 					break;
 			 					case transRel.categoryid :
 			 					
 			 					break;
 			 					case transRel.profirldname :
 			 						if(is_process==1){
 			 							var productId=await self.getProductId(lineItem.productcode._text);
 			 							if(productId==false){
 			 								if(LBL_VALIDATE_RPI_PROD_CODE.toLowerCase()=='true'){
 			 									audit.statusCode='FN8212';
 				 								audit.statusMsg="Invalid Product Code "
 				 								audit.reason="Product Is Not Availabale with provided input"+lineItem.productcode._text;
 				 								audit.status='Failed';
 				 								audit.subject=so.subject;
 								 				audit.saveLog(dbconn);
 								 				self.trash(so.salesorderid);
 								 				self.updateSubject(so.salesorderid,so.subject+'_'+so.salesorderid);
 								 				self.isFailure=true;
 								 				continue lineItemsIteration;
 			 								}
 			 								else{
 			 									xrsoProdRel['productname']='0';
 			 									xrsoProdRel['productcode']=lineItem.productcode._text;
 			 									xrsoProdRel[transRel.profirldname]=productId;
 			 								}
 			 							}
 			 							else{
 			 								xrsoProdRel['productname']=productId;
 			 								xrsoProdRel[transRel.profirldname]=productId;
 			 								xrsoProdRel['productcode']=lineItem.productcode._text;
 			 							}
 			 						}
 			 					break;
 			 					case transRel.uom :
 			 						if(is_process==1){
 			 							var uomId=await self.getUomId(lineItem.tuom.uomname._text);
 			 							if(uomId==false){
 			 									audit.statusCode='FN8213';
 				 								audit.statusMsg="Invalid UOM - "+lineItem.tuom.uomname._text;
 				 								audit.reason="UOM Is Not Availabale with provided input "+lineItem.tuom.uomname._text;
 				 								audit.status='Failed';
 				 								audit.subject=so.subject;
 								 				audit.saveLog(dbconn);
 								 				self.trash(so.salesorderid);
 								 				self.updateSubject(so.salesorderid,so.subject+'_'+so.salesorderid);
 								 				self.isFailure=true;
 								 				continue lineItemsIteration;

 			 							}else{
 			 								var isProdUomMapped= await self.isProdUomMap(xrsoProdRel['productid'],uomId);
 			 								if(!isProdUomMapped){
 			 									
 			 									if(LBL_VALIDATE_RPI_PROD_CODE.toLowerCase() == 'true'){
 			 										audit.statusCode='FN8218';
 					 								audit.statusMsg= "product id :"+ productId+" & uom id: "+uomId+" are Not Mapped";
 					 								audit.reason= "product id :"+ productId+" & uom id: "+uomId+" are Not Mapped";
 					 								audit.status='Failed';
 					 								audit.subject=so.subject;
 									 				audit.saveLog(dbconn);
 									 				self.trash(so.salesorderid);
 								 					self.updateSubject(so.salesorderid,so.subject+'_'+so.salesorderid);
 								 					self.isFailure=true;
 													continue lineItemsIteration;

 			 									}	
 			 								}
 			 								xrsoProdRel[transRel.uom]=uomId;
 			 							}
 			 						}
 			 						
 			 					break;
 			 					case 'tax1' :
 			 						try{
 			 							var tax1=lineItem.tax1._text;
 			 							xrsoProdRel['tax1']=tax1
 			 						}
 			 						catch(e){
 			 							xrsoProdRel['tax1']='0';
 			 						}
 			 						xrsoProdRel['tax2']='0';
 			 						xrsoProdRel['tax3']='0';
 			 					break;

 			 					case 'quantity' :
 			 						try{
 			 							var quantity=Number(lineItem.quantity._text);
 			 							if(quantity>0){
 			 								xrsoProdRel['quantity']=quantity;
 			 							}
 			 							else{
 			 							
 			 								audit.statusCode='FN8213';
 				 							audit.statusMsg="Invalid Quantity";
 				 							audit.reason="quantity Is Not Availabale";
 				 							audit.status='Failed';
 				 							audit.subject=so.subject;
 								 			audit.saveLog(dbconn);
 								 			self.trash(so.salesorderid);
 								 			self.updateSubject(so.salesorderid,so.subject+'_'+so.salesorderid);
 								 			self.isFailure=true;
 											continue lineItemsIteration;
 			 							}
 			 						}catch(e){
 			 							audit.statusCode='FN8214';
 				 						audit.statusMsg="Invalid Quantity";
 				 						audit.reason="quantity Is Not Availabale";
 				 						audit.status='Failed';
 				 						audit.subject=so.subject;
 								 		audit.saveLog(dbconn);
 								 		self.trash(so.salesorderid);
 								 		self.updateSubject(so.salesorderid,so.subject+'_'+so.salesorderid);
 								 		self.isFailure=true;
 								 		continue lineItemsIteration;
 			 						}
 			 					break;
 			 					case 'baseqty':
 			 						try{
 			 							xrsoProdRel['baseqty']=lineItem.baseqty._text;
 			 						}
 			 						catch(e){
 			 							xrsoProdRel['baseqty']=Number(lineItem.quantity._text);
 			 						}
 			 						

 			 					break;
 			 					default:
 			 						try{
 			 							xrsoProdRel[field.columnname]=lineItem[field.columnname]._text;
 			 						}
 			 						catch(e){
 			 							
 			 						}
 			 					break;
 			 				}
 			 			}
 			 			
 			 			xrsoProdRel.save().then(res=>{
 			 				console.log(res);
 			 			}).catch(e=>{
 			 				self.isFailure=true;
 			 			});
 			 		
 			 		}
 			 		
 			 		return Promise.resolve(true);
 			 	
 		
 	}
 	rSalesOrder.prototype.isProdUomMap=async function(productId,uomId){
 		var self=this;
 		const dbconn=this.getDb();
 		const Product=dbconn.import('./../../models/product');
 		const ProductCf=dbconn.import('./../../models/product-cf');
 		var prodUomFields=await self.getProductUomFields('vtiger_xproduct');
 		var prodUomCusFields=await self.getProductUomFields('vtiger_xproductcf');
 		return ProductCf.findOne({
 				where:{
 					xproductid:productId,
 				},
 				attributes:prodUomCusFields,
 				include:[{model:Product,required:true,attributes:prodUomFields}],
 				raw: true,
 			}).then(uoms => {
 				return Object.values(uoms).includes(uomId);
 			}).catch(e=>{
 				return false;
 			});

 		 
 	}
 	rSalesOrder.prototype.getProductUomFields=async function(tableName){
 		const dbconn=this.getDb();
 		const VtigerField=dbconn.import('./../../models/vtiger-field');

 		return VtigerField.findAll({
 			where:{
 				tablename:tableName,
 				presence:[0,2],
 				typeofdata:{[Op.like]:'%UOM%'}
 			},
 			attributes: ['columnname'],
 			raw: true,
 			}).then(fields => {
 				var uoms=fields.map((uom)=>{
 					return uom.columnname;
 				});
 				return uoms;
 			}).catch(e=>{
 				return e.error;
 			});

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
 				smcreatorid:0,
 				smownerid:0,
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
