const { BaseModule }=require('../../core');
const { __extends }=require('tslib');
const CollecReader=require('./collec-reader');
const Audit=require('../../utils/audit');
const Log=require('../../utils/log');
const XmlFile=require('../../utils/xml-file');
var Sequelize = require("sequelize");
var moment = require('moment');
const Op = Sequelize.Op
const { QueryTypes } = require('sequelize');
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
 	rSalesOrder.prototype.import=async function(xml,xmlFile){
 		try{
 			
 			var xmlf=new XmlFile();
 			xmlf.setLog(this.getLog());
 			xmlf.basedir='./public/uploads';
 			xmlf.module='xrSalesOrder';

 			xmlf.fileName=moment().format('YYYYMMDDHHmmss.SSS');
 			xmlf.date=moment().format('YYYY-MM-DD');
 			xmlf.logDir();
 			var log_path=xmlf.getLogDir();
 			this.saveXml(xml,'xrSalesOrder');
 			this.importAssoc();
 			
 			var dbconn=this.getDb();
 			var crdr=new CollecReader(this._xmljs);
 			var log=new Log(log_path+'/'+crdr.transactionId()+'-'+moment().format('HHmmss.SSS')+Math.random().toString(36).substring(7)+'-log.log');
 			log.setLogger();
 			log.info("=========================RSO Start==================")
 			log.info("Module Name: xrSalesOrder");
 			log.info("XML File : "+xmlFile);
 			var audit=new Audit();
 			audit.docName=crdr.transactionId();
 			audit.distCode=crdr.fromId();
 			audit.options="Receive";
 			audit.source=crdr.sourceApplication();
 			audit.docCreatedDate=crdr.createdDate();
 			audit.destination=crdr.destApplication();
 			audit.docType=crdr.docType();
 			log.info("************* Document Information - start ***************");
 			log.info("TransactionId: "+crdr.transactionId());
 			log.info("fromId: "+crdr.fromId());
 			log.info("prkey: "+crdr.prkey());
 			log.info("docType: "+crdr.docType());
 			log.info("************* Document Information - end ***************");


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
 			log.info("************* Transaction -vtiger_xrso- start ***************");

 			var fields=await this.getFields(log);
 			var baseColl=await crdr.xrso();
 			var LBL_AUTO_RSO_TO_SO=await this.getInvMgtConfig('LBL_AUTO_RSO_TO_SO');
 			var LBL_RSO_SUB_RETAILER_CONVERT= await this.getInvMgtConfig('LBL_RSO_SUB_RETAILER_CONVERT');
 			var self=this;
 			if(Object.getPrototypeOf( baseColl ) === Object.prototype){
 				var baseColls=[baseColl];
 			}
 			else{
 				var baseColls=baseColl;
 			}
 			await baseColls.reduce(async (promise, coll) => {
 				await promise;
 				const distributorId=coll.distributor_id._text;
 				const customerType=coll.customer_type._text;
 				const {rso, rsocf} = await self.prepareValues(coll,fields,audit,log,distributorId,crdr.prkey());
 				await dbconn.transaction().then(async (t) => {
 					return await rso.save({transaction: t,logging:(msg)=>{log.debug(msg);}}).then(async (so) => {
 						return await rsocf.save({transaction:t,logging:(msg)=>{log.debug(msg);}}).then(async (socf)=>{
 							if(t.commit()){
 								log.info("============ Related Modules: Bill Ads, Ship Ads ===============")
 								await self.updateBillShipAds(socf.salesorderid,log);
 								await self.save(socf.salesorderid,log);
 								log.info("************* Transaction -vtiger_xrso- end ***************");
 								log.info("*********************** vtiger_xrso - lineItems update start **************")
 								await self.updateLineItems(so,audit,coll.lineitems,log,crdr.prkey());
 								log.info("****************** vtiger_xrso lineitems update -end *********************")
 								if(LBL_AUTO_RSO_TO_SO.toLowerCase()=='true' && LBL_RSO_SUB_RETAILER_CONVERT.toLowerCase()=='true' && Number(so.customer_type)!=2){
 									log.info('LBL_AUTO_RSO_TO_SO : '+LBL_AUTO_RSO_TO_SO);
 									log.info('LBL_RSO_SUB_RETAILER_CONVERT : '+LBL_RSO_SUB_RETAILER_CONVERT);
 									log.info("*********** RSO to SO conversion start ************")
 									await self.autoRsoToSo(so,socf,distributorId,customerType,log);	
 									log.info("*********** RSO to SO conversion end ***************");

 									await dbconn.query("update vtiger_xrso set status=?,is_processed=? where salesorderid=?",{
 										type:QueryTypes.UPDATE,
 										replacements:['Processed',2,so.salesorderid],
 										logging:(msg)=>{
 											log.debug(msg);
 										}
 									}).then(()=>{
 										log.info("xrso status updated");
 									}).catch(e=>{
 										log.error(e.message+ " issue with xrso update status");
 									});
 									await dbconn.query("update vtiger_xrsocf set cf_xrso_next_stage_name='' where salesorderid=?",{
 										type:QueryTypes.UPDATE,
 										replacements:[so.salesorderid],
 										logging:(msg)=>{
 											log.debug(msg);
 										}
 									}).then(()=>{
 										log.info("vtiger_xrsocf next stage updated");
 									}).catch(e=>{
 										log.error(e.message + " issue with vtiger_xrsocf update");
 									})
 									
 									
 								}

 							}
 						});
 					}).then(async (t) => {

 					}).catch(async (err) => {
 						audit.statusCode='FN2010';
 						audit.statusMsg=err.message;
 						audit.reason=err.message;
 						audit.status='Failed';
 						audit.subject=rso.subject;
 						audit.saveLog(dbconn,log);
 						self.isFailure=true;
 						return await t.rollback();
 					});
 				});

 			}, Promise.resolve());

 			log.info("=========================RSO End==================")
 		}
 		catch(e){
 			
 			return  Promise.reject(e);
 		}
 		
 		return Promise.resolve(this.updateStatus(self.isFailure));

 	};
 	rSalesOrder.prototype.prepareValues=async function(coll,fields,audit,log,distId,prkey){
 		var self=this;
 		var dbconn=this.getDb();
 		const rSalesOrder=dbconn.import('./../../models/rsalesorder');
 		const rSalesOrderCf=dbconn.import('./../../models/rsalesorder-cf');
 		const CurrencyInfo=dbconn.import('./../../models/currency-info');
 		var rso=new rSalesOrder();
 		var rsocf=new rSalesOrderCf();
 		var salesorderid=await self.getCrmEntity('xrSalesOrder',log);
 		log.info("CrmEntity last inserted ID used as salesorderid: "+salesorderid)
 		rso.salesorderid=salesorderid;
 		rsocf.salesorderid=salesorderid;
 		rso.lbl_rso_save_pro_cate=await self.getInvMgtConfig('lbl_rso_save_pro_cate');

 		await fields.reduce(async (promise, field) => {
 			await promise;

 			switch(field.uitype){
 				case 117:
 				log.info("=========== Related Module: Currency ================")
 				await CurrencyInfo.findOne({
 					where:{currency_code:coll.currency_id.currency_code._text},
 					logging:(msg)=>{
 						log.info("currency code: "+coll.currency_id.currency_code._text);
 						log.debug(msg);
 					}
 				}).then(currency=>{
 					log.info(field.columnname+" : "+currency.id+" type of data :" +field.typeofdata+" ui type : " +field.uitype);
 					rso[field.columnname]=currency.id;
 					rsocf[field.columnname]=currency.id;

 				}).catch(e=>{
 					throw new Error('Unable to get the currency id for sales order');
 				});
 				break;
 				case 10:
 			 	 //default related module for buyerid is xRetailer
 			 	 switch(field.columnname){
 			 	 	case 'buyerid':
 			 	 	log.info("=========== Related Module: Customer ================")
 			 	 	var buyerid=await self.getBuyerId(coll.customer_type._text,coll,log,distId,prkey);
 			 	 	
 			 	 	if(buyerid){
 			 	 		log.info(field.columnname+" : "+buyerid+" type of data :" +field.typeofdata+" ui type : " +field.uitype);


 			 	 		rso[field.columnname]=buyerid;
 			 	 		rsocf[field.columnname]=buyerid;
 			 	 	}
 			 	 	else{
 			 	 		log.error("unable to get the buye id :"+buyerid);
 			 	 		audit.statusCode='FN8200';
 			 	 		audit.statusMsg="Due to Invalid data, we are unable to get the buyer id";
 			 	 		audit.reason="Error while getting the related module data";
 			 	 		audit.status='Failed';
 			 	 		audit.subject=coll.subject._text;
 			 	 		audit.saveLog(dbconn,log);
 			 	 		self.isFailure=true;
 			 	 	}
 			 	 	break;

 			 	 	case 'cf_xrso_beat':
 			 	 	log.info("=========== Related Module: Beat ================")

 			 	 	var beatId=await self.getBeat(coll,log,distId,prkey);
 			 	 	if(beatId){
 			 	 		log.info(field.columnname+" : "+beatId+" type of data :" +field.typeofdata+" ui type : " +field.uitype);
 			 	 		rso[field.columnname]=beatId;
 			 	 		rsocf[field.columnname]=beatId;
 			 	 	}
 			 	 	else{
 			 	 		log.error("Unable to get the beat info");
 			 	 		audit.statusCode='FN8216';
 			 	 		audit.statusMsg="Invalid Beat";
 			 	 		audit.reason="Error while getting the related module data";
 			 	 		audit.status='Failed';
 			 	 		audit.subject=coll.subject._text;
 			 	 		audit.saveLog(dbconn,log);
 			 	 		self.isFailure=true;
 			 	 	}
 			 	 	break;
 			 	 	case 'cf_xrso_sales_man':
 			 	 	log.info("=========== Related Module: Salesman ================")

 			 	 	try{
 			 	 		log.info(field.columnname+" : "+coll.cf_xrso_sales_man.salesmanid._text+" type of data :" +field.typeofdata+" ui type : " +field.uitype);
 			 	 		rso[field.columnname]= coll.cf_xrso_sales_man.salesmanid._text;
 			 	 		rsocf[field.columnname]= coll.cf_xrso_sales_man.salesmanid._text;
 			 	 	}
 			 	 	catch(e){
 			 	 		log.error("Unable to get the salesman info");
 			 	 		audit.statusCode='FN8210';
 			 	 		audit.statusMsg="Invalid Salesman code";
 			 	 		audit.reason="Error while getting the related module data";
 			 	 		audit.status='Failed';
 			 	 		audit.subject=coll.subject._text;
 			 	 		audit.saveLog(dbconn,log);
 			 	 		self.isFailure=true;
 			 	 	}

 			 	 	break;
 			 	 	case 'cf_salesorder_transaction_series':
 			 	 	log.info("=========== Related Module: Transaction series ================")

 			 	 	var transSeries=await self.getTransactionSeries(coll,log);
 			 	 	log.info(field.columnname+" : "+transSeries);  
 			 	 	rso[field.columnname]= transSeries;
 			 	 	rsocf[field.columnname]=transSeries;
 			 	 	break;

 			 	 }
 			 	 break;
 			 	 default:
	 		                         
	 		                         if(field.typeofdata.includes('M')){
	 		                         	if(coll[field.columnname]!=='undefined' &&coll[field.columnname]!==null && Object.keys(coll[field.columnname]).length>0){
	 		                         		log.info(field.columnname+" : "+coll[field.columnname]._text+" typeof data: "+field.typeofdata+" ui type: "+field.uitype);
	 		                         		rso[field.columnname]= coll[field.columnname]._text;
	 		                         		rsocf[field.columnname]= coll[field.columnname]._text;
	 		                         	}
	 		                         	else{
	 		                         		log.error(ield.columnname+" is required");
	 		                         		audit.statusCode='FN8210';
	 		                         		audit.statusMsg=field.columnname+" is required";
	 		                         		audit.reason=field.columnname+" is required";
	 		                         		audit.status='Failed';
	 		                         		audit.subject=coll.subject._text;
	 		                         		audit.saveLog(dbconn,log);
	 		                         		self.isFailure=true;
	 		                         	} 
	 		                         }
	 		                         else{
	 		                         	if(field.columnname!='crmid' && field.columnname!='cf_xrso_type'){
	 		                         		
	 		                         		if( typeof (coll[field.columnname]) !=='undefined' &&coll[field.columnname]!=='undefined' && coll[field.columnname]!==null && Object.keys(coll[field.columnname]).length>0){
	 		                         			log.info(field.columnname+" : "+coll[field.columnname]._text+" typeof data: "+field.typeofdata+" ui type: "+field.uitype);
	 		                         			rso[field.columnname]= coll[field.columnname]._text;
	 		                         			rsocf[field.columnname]= coll[field.columnname]._text;
	 		                         		} 
	 		                         	}
	 		                         }
	 		            
	 		               break;
	 		           }



	 		       }, Promise.resolve());

return {rso:rso,rsocf: rsocf}; 
}

rSalesOrder.prototype.getFields=async function (log){
	const dbconn=this.getDb();
	const VtigerField=dbconn.import('./../../models/vtiger-field');
	const rSalesOrder=dbconn.import('./../../models/rsalesorder');
	const VtigerTab=dbconn.import('./../../models/vtiger-tab')
	log.info("Module table Names: "+rSalesOrder.tableName+","+rSalesOrder.tableName+'cf');
	return VtigerField.findAll({
		where:{
			tablename:[rSalesOrder.tableName,rSalesOrder.tableName+'cf'],xmlreceivetable:1},
			attributes: ['fieldid','columnname','typeofdata','uitype','tabid'],
			include:[{model:VtigerTab,required:true,attributes:['tabid','name']}],
			logging:(msg)=>{
				log.debug(msg);
			}
		}).then(fields => {
			return fields;
		}).catch(e=>{
			return e.error;
		});
	}
	rSalesOrder.prototype.getTransGridFields=async function (tableName,log){
		log.info("======== Related Module: sify_tr_grid_field ================")
		const dbconn=this.getDb();
		const XGridField=dbconn.import('./../../models/x-grid-field');

		return XGridField.findAll({
			where:{
				tablename:tableName,xmlreceivetable:1},
				attributes: ['columnname'],
				logging:(msg)=>{
					log.debug(msg);
				}
			}).then(fields => {
				return fields;
			}).catch(e=>{

				return e.error;
			});
		}
		rSalesOrder.prototype.updateBillShipAds=async function (soId,log){
			const dbconn=this.getDb();
			const RsoBillAds=dbconn.import('./../../models/rso-bill-ads');
			const RsoShipAds=dbconn.import('./../../models/rso-ship-ads');

			var rsoBillAds=new RsoBillAds();
			rsoBillAds['sobilladdressid']=soId;
			rsoBillAds.save({logging:(msg)=>{log.debug(msg)}}).then().catch(e=>{
				log.error(e.message);
			});
			var rsoShipAds=new RsoShipAds();
			rsoShipAds['soshipaddressid']=soId;
			rsoShipAds.save({logging:(msg)=>{log.debug(msg)}}).then().catch(e=>{
				log.error(e.message);
			});
			return true;
		}
		rSalesOrder.prototype.getTransRel=async function(log){
			log.info("======== Related Module: sify_tr_rel ======================")
			const dbconn=this.getDb();
			const TransRel=dbconn.import('./../../models/trans-rel');
			return TransRel.findOne({
				where:{'transaction_name':'xrSalesOrder'},
				attributes:['transaction_rel_table','profirldname','relid','uom','categoryid','receive_pro_by_cate'],
				logging:(msg)=>{
					log.debug(msg);
				}
			}).then(relation=>{
				return relation;
			}).catch(e=>{

				throw new Error("Unable to get the tranaction related information");
			});
		}

		rSalesOrder.prototype.getBeat=async function(coll,log,distId,prkey){
			var dbconn=this.getDb();
			var self=this;
			const Beat=dbconn.import('./../../models/beat');
			const {columnname,entityidfield}=await self.getEnityForRelativeModules('xBeat','',prkey,log,'');
			if(columnname!='' && entityidfield!=''){
				return Beat.findOne({
					where:{[columnname]:coll.cf_xrso_beat.beatcode._text,deleted:0,cf_xbeat_distirbutor_id:distId},
					attributes:[entityidfield],
					logging:(msg)=>{
						log.debug(msg);
					}
				}).then(beat=>{
					if(beat){
						return beat[entityidfield];
					}
					else{
						return false;
					}

				}).catch(e=>{
					return false;
				});
			}
			else{
				log.error(" unable to get related module values for module:Beat")
				return false
			}
			
		}
		rSalesOrder.prototype.getInvMgtConfig=async function(key){
			var dbconn=this.getDb();
			const InvMgtConfig=dbconn.import('./../../models/inv-mgt-config');
			return InvMgtConfig.findOne({
				where:{key:key},
				attributes:['value']
			}).then(config=>{
				if(config){
					return config.value;
				}
				else{
					return false;
				}

			}).catch(e=>{
				return false;
			});
		}
		rSalesOrder.prototype.getProductTrackSerial=async function (productId,log){

			var dbconn=this.getDb();
			const Product=dbconn.import('./../../models/product');
			return Product.findOne({
				where:{xproductid:productId},
				attributes:['track_serial_number'],
				logging:(msg)=>{
					log.debug(msg);
				}
			}).then(product=>{
				if(product){
					if(product['track_serial_number'].toLowerCase()=='yes'){
						return 1;
					}
					else{
						return 0;
					}
				}
				else{
					return 0;
				}

			}).catch(e=>{
				return 0;
			});

		}
		rSalesOrder.prototype.getProductId=async function(productCode,log,prkey){
			var dbconn=this.getDb();
			var self=this;
			const {columnname,entityidfield}=await self.getEnityForRelativeModules('xProduct','',prkey,log,'');
			if(columnname!='' && entityidfield!=''){
				const Product=dbconn.import('./../../models/product');
				return Product.findOne({
					where:{productcode:productCode},
					attributes:['xproductid'],
					logging:(msg)=>{
						log.debug(msg);
					}
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
			else{
				log.error("unable get relate module entityidfield and columnname for xProduct");
				return false;
			}
			
		}
		rSalesOrder.prototype.getUomId=async function(uomName,log){
			var dbconn=this.getDb();
			const Uom=dbconn.import('./../../models/uom');
			return Uom.findOne({
				where:{uomname:uomName},
				attributes:['uomid'],
				logging:(msg)=>{
					log.debug(msg);
				}
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
		rSalesOrder.prototype.trash=function(soId,log){
			var dbconn=this.getDb();
			const CrmEntity=dbconn.import('./../../models/crmentity');
			const rSalesOrder=dbconn.import('./../../models/rsalesorder');
			const rSalesOrderCf=dbconn.import('./../../models/rsalesorder-cf');
			const XrsoProdRel=dbconn.import('./../../models/xrso-prod-rel');
			CrmEntity.update(
				{modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),deleted:1},
				{where: {crmid:soId},logging:(msg)=>{
					log.debug(msg);
				}}
				).then().catch();
			rSalesOrder.update(
				{modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),deleted:1},
				{where: {salesorderid:soId},logging:(msg)=>{
					log.debug(msg);
				}}
				).then().catch();
			rSalesOrderCf.update(
				{modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),deleted:1},
				{where: {salesorderid:soId},logging:(msg)=>{
					log.debug(msg);
				}}
				).then().catch();

			XrsoProdRel.update(
				{modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),deleted:1},
				{where: {id:soId},logging:(msg)=>{
					log.debug(msg);
				}}
				).then().catch();


		}
		rSalesOrder.prototype.save=async function(soId,log){

			var dbconn=this.getDb();
			const CrmEntity=dbconn.import('./../../models/crmentity');
			const rSalesOrder=dbconn.import('./../../models/rsalesorder');
			const rSalesOrderCf=dbconn.import('./../../models/rsalesorder-cf');
			const XrsoProdRel=dbconn.import('./../../models/xrso-prod-rel');
			const rsoBillAds=dbconn.import('./../../models/rso-bill-ads');
			const rsoShipAds=dbconn.import('./../../models/rso-ship-ads');

			CrmEntity.update(
			{
				modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),
				created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
				deleted:0},
				{where: 
					{crmid:soId}},
					{logging:(msg)=>{
						log.debug(msg);
					}}
					).then().catch();
			rSalesOrder.update(
			{
				modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),
				created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
				deleted:0},
				{where: {salesorderid:soId}},
				{logging:(msg)=>{
					log.debug(msg);
				}}
				).then().catch();
			rSalesOrderCf.update(
			{
				modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),
				created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
				deleted:0},
				{where: {salesorderid:soId}},
				{logging:(msg)=>{
					log.debug(msg);
				}}
				).then().catch();

			XrsoProdRel.update(
				{modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),deleted:1},
				{where: {id:soId}},
				{logging:(msg)=>{
					log.debug(msg);
				}}
				).then().catch();
			rsoBillAds.update(
			{
				modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),
				created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
				deleted:0},
				{where: {sobilladdressid:soId}},
				{logging:(msg)=>{
					log.debug(msg);
				}}
				).then().catch();
			rsoShipAds.update(
			{
				modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),
				created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
				deleted:0},
				{where: {soshipaddressid:soId}},
				{logging:(msg)=>{
					log.debug(msg);
				}}
				).then().catch();		
		}
		rSalesOrder.prototype.updateSubject= function(soId,subject,log){
			var dbconn=this.getDb();
			const rSalesOrder=dbconn.import('./../../models/rsalesorder');
			rSalesOrder.update(
			{
				subject:subject
			},
			{where: {salesorderid:soId}},
			{logging:(msg)=>{
				log.debug(msg);
			}}
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
		rSalesOrder.prototype.getTransactionSeries=async function(coll,log){
			var dbconn=this.getDb();
			const XSeries=dbconn.import('./../../models/x-series');
			return XSeries.findOne({
				where:{transactionseriescode:coll.cf_salesorder_transaction_series.transactionseriescode._text,
					deleted:0,
					xdistributorid:coll.distributor_id._text,
					logging:(msg)=>{
						log.debug(msg)
					}
				},
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
		rSalesOrder.prototype.getXrsoProdRel=async function(soId){
			try{
				var dbconn=this.getDb();
				const rSoProductRel=dbconn.import('./../../models/rso-productrel');
				return rSoProductRel.findAll({
					where:{id:soId}
				}).then(prodRel=>{
					return prodRel;
				}).catch(e=>{
					return false;
				});
			}catch(e){
				return false;
			}
		}

		rSalesOrder.prototype.getBuyerId=async function(customerType,coll,log,distId,prkey){
			var dbconn=this.getDb();
			var self=this;
			const Retailer=dbconn.import('./../../models/retailer');
			const SubRetailer=dbconn.import('./../../models/sub-retailer');
			const RecCustMaster=dbconn.import('./../../models/rec-cust-mas');
			log.info("Customer type: "+ customerType)
			switch(customerType){
				case '1':
				log.info("=========== Related sub-module: ReceiveCustomerMaster ================")
				var {columnname,entityidfield}=await self.getEnityForRelativeModules('xReceiveCustomerMaster','',prkey,log,'');

				if((typeof(columnname)=='undefined' || columnname=='undefined'||columnname==null) || entityidfield=='undefined'|| typeof(entityidfield)=='undefined' || entityidfield==null){
					log.error(" Unable to get the related field values for module: xReceiveCustomerMaster");
					return false
				}
				else{
					return  RecCustMaster.findOne({
						where:{
							[Op.and]: [
							  { deleted:0 },
							  { distributor_id:distId},
							  {[columnname]:coll.buyerid.customercode._text}
							]
						},
						attributes:[entityidfield],
						logging:(msg)=>{
							log.debug(msg);
						}
					}).then(retailer=>{
						if(retailer){
							return retailer[entityidfield];
						}
						else{
							return false;
						}
					}).catch(e=>{
						log.error(e.message)
						return false;
					});
				}
				
				
				break;
				case '2':
				log.info("=========== Related sub-module: SubRetailer ================")
				var {columnname,entityidfield}=await self.getEnityForRelativeModules('xsubretailer','',prkey,log,'');
				if(columnname!='' && entityidfield!=''){
					return await SubRetailer.findOne({
						where:{[columnname]:coll.buyerid.customercode._text,deleted:0,distributor_id:distId},
						attributes:[entityidfield],
						logging:(msg)=>{
							log.debug(msg);
						}
					}).then(subretailer=>{

						if(subretailer){

							return subretailer[entityidfield];
						}
						else{

							return false;
						}
					}).catch(e=>{
						log.error(e.message);
						return false;
					});
				}
				else{
					log.error(" Unable to get the related field values for module: xsubretailer");
				}
				
				break;
				case '0':
				log.info("=========== Related sub-module: Retailer ================")
				var {columnname,entityidfield}=await self.getEnityForRelativeModules('xRetailer','',prkey,log,'');
				if(columnname!='' && entityidfield!=''){
					return Retailer.findOne({
						where:{[columnname]:coll.buyerid.unique_retailer_code._text,deleted:0,distributor_id:distId},
						attributes:[entityidfield],
						logging:(msg)=>{
							log.debug(msg);
						}
					}).then(retailer=>{
						if(retailer){
							return retailer[entityidfield];
						}
						else{
							return false;
						}
					}).catch(e=>{
						return false;
					});	
				}
				else{
					log.error("unable to get the related columnname for module : xRetailer");
					return false;
				}

			}
		}

		rSalesOrder.prototype.updateLineItems=async function(so,audit,coll,log,prkey){

			var self=this;
			var dbconn=this.getDb();
			const XrsoProdRel=dbconn.import('./../../models/xrso-prod-rel');
			var transRel=await self.getTransRel(log);
			var transGridFields=await self.getTransGridFields(transRel.transaction_rel_table,log);
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
							log.info("====== product details ==============")
							var productId=await self.getProductId(lineItem.productcode._text,log,prkey);
							if(productId==false){
								if(LBL_VALIDATE_RPI_PROD_CODE.toLowerCase()=='true'){
									audit.statusCode='FN8212';
									audit.statusMsg="Invalid Product Code "
									audit.reason="Product Is Not Availabale with provided input"+lineItem.productcode._text;
									audit.status='Failed';
									audit.subject=so.subject;
									audit.saveLog(dbconn,log);
									self.trash(so.salesorderid,log);
									self.updateSubject(so.salesorderid,so.subject+'_'+so.salesorderid,log);
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
							log.info("====== uom details ==============")
							var uomId=await self.getUomId(lineItem.tuom.uomname._text,log);
							if(uomId==false){
								audit.statusCode='FN8213';
								audit.statusMsg="Invalid UOM - "+lineItem.tuom.uomname._text;
								audit.reason="UOM Is Not Availabale with provided input "+lineItem.tuom.uomname._text;
								audit.status='Failed';
								audit.subject=so.subject;
								audit.saveLog(dbconn,log);
								self.trash(so.salesorderid,log);
								self.updateSubject(so.salesorderid,so.subject+'_'+so.salesorderid,log);
								self.isFailure=true;
								continue lineItemsIteration;

							}else{
								var isProdUomMapped= await self.isProdUomMap(xrsoProdRel['productid'],uomId,log);
								if(!isProdUomMapped){

									if(LBL_VALIDATE_RPI_PROD_CODE.toLowerCase() == 'true'){
										audit.statusCode='FN8218';
										audit.statusMsg= "product id :"+ productId+" & uom id: "+uomId+" are Not Mapped";
										audit.reason= "product id :"+ productId+" & uom id: "+uomId+" are Not Mapped";
										audit.status='Failed';
										audit.subject=so.subject;
										audit.saveLog(dbconn,log);
										self.trash(so.salesorderid,log);
										self.updateSubject(so.salesorderid,so.subject+'_'+so.salesorderid,log);
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
							if(typeof(tax1)=='undefined'||tax1=='undefined' || tax1==''){
								xrsoProdRel['tax1']='0';
							}
							else{
								xrsoProdRel['tax1']=tax1
							}
							
							log.info("tax1: "+tax1);
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
								log.info("quantity: "+ quantity);
								xrsoProdRel['quantity']=quantity;
							}
							else{
								log.error("Invalid Quantity");
								audit.statusCode='FN8213';
								audit.statusMsg="Invalid Quantity";
								audit.reason="quantity Is Not Availabale";
								audit.status='Failed';
								audit.subject=so.subject;
								audit.saveLog(dbconn,log);
								self.trash(so.salesorderid,log);
								self.updateSubject(so.salesorderid,so.subject+'_'+so.salesorderid,log);
								self.isFailure=true;
								continue lineItemsIteration;
							}
						}catch(e){
							log.error("Invalid Quantity");
							audit.statusCode='FN8214';
							audit.statusMsg="Invalid Quantity";
							audit.reason="quantity Is Not Availabale";
							audit.status='Failed';
							audit.subject=so.subject;
							audit.saveLog(dbconn,log);
							self.trash(so.salesorderid,log);
							self.updateSubject(so.salesorderid,so.subject+'_'+so.salesorderid,log);
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
							if(lineItem[field.columnname]!=='undefined' && lineItem[field.columnname]!==null && Object.keys(lineItem[field.columnname]).length>0){
								log.info(field.columnname+" : "+lineItem[field.columnname]._text);
								xrsoProdRel[field.columnname]=lineItem[field.columnname]._text;
							}
						}
						catch(e){

						}
						break;
					}
				}

				xrsoProdRel.save({logging:(msg)=>{
					log.debug(msg);
				}}).then(res=>{

				}).catch(e=>{
					self.isFailure=true;
				});

			}

			return Promise.resolve(true);


		}
		rSalesOrder.prototype.isProdUomMap=async function(productId,uomId,log){
			var self=this;
			const dbconn=this.getDb();
			const Product=dbconn.import('./../../models/product');
			const ProductCf=dbconn.import('./../../models/product-cf');
			var prodUomFields=await self.getProductUomFields('vtiger_xproduct');
			var prodUomCusFields=await self.getProductUomFields('vtiger_xproductcf');
			log.info("========== checking if the product and uom mapped ================")
			return ProductCf.findOne({
				where:{
					xproductid:productId,
				},
				attributes:prodUomCusFields,
				include:[{model:Product,required:true,attributes:prodUomFields}],
				raw: true,
				logging:(msg)=>{
					log.debug(msg)
				}
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
		rSalesOrder.prototype.autoRsoToSo=async function(rso,rsocf,distId,custType,log){
			try{
				var self=this;
				const dbconn=this.getDb();
				var LBL_SET_NETRATE=self.getInvMgtConfig('LBL_SET_NETRATE');
				var ALLOW_GST_TRANSACTION=self.getInvMgtConfig('ALLOW_GST_TRANSACTION');
				var SO_LBL_TAX_OPTION_ENABLE=self.getInvMgtConfig('SO_LBL_TAX_OPTION_ENABLE');
				var SO_LBL_CURRENCY_OPTION_ENABLE=self.getInvMgtConfig('SO_LBL_CURRENCY_OPTION_ENABLE');
				var isSoConverted=await self.isSoConverted(rso.salesorderid,log);
				log.info("isSoConverted : "+isSoConverted);
				if(isSoConverted){
					rsocf.cf_xrso_next_stage_name='';
					rsocf.save({logging:(msg)=>{
						log.debug(msg);
					}});
					rso.status='Processed';
					rso.is_processed=2;
					rso.save({logging:(msg)=>{
						log.debug(msg);
					}});
					return true;
				}
				var convertToSo = false;
				var nextStage= await self.getStageAction('Create SO',log);
				if(nextStage.cf_workflowstage_business_logic=='Forward to SO'){
					convertToSo=true;
				}
				if(!convertToSo){
					rsocf.cf_xrso_next_stage_name=nextStage.cf_workflowstage_next_stage;
					rsocf.save({logging:(msg)=>{
						log.debug(msg);
					}});
					rso.status=nextStage.cf_workflowstage_next_content_status;
					rso.save({logging:(msg)=>{
						log.debug(msg);
					}});
					return true;
				}

				var salesOrderId=await self.getCrmEntity('xSalesOrder',log);
 			//get Salesorder Object 
 			log.info("xSalesOrder crmentity id :"+salesOrderId)
 			var {so,socf,soBillAds,soShipAds}= await self.prepareSo(salesOrderId,rso,rsocf,distId,custType,log);

 			await dbconn.transaction().then(async (t) => {
 				return await so.save({transaction: t,logging:(msg)=>{log.debug(msg);}}).then(async (so) => {
 					return await socf.save({transaction:t,logging:(msg)=>{log.debug(msg);}}).then(async (socf)=>{
 						if(t.commit()){
 							await self.updateCrmRelEntity(rso['salesorderid'],'xrSalesOrder',so['salesorderid'],'xSalesOrder',log)
 							var netTotal=await self.updateSoLineItems(so,socf,rso.salesorderid,distId,log);
 							
 							await soBillAds.save({logging:(msg)=>{
 								log.debug(msg);
 							}}).then().catch(e=>{
 								log.error(e.message)
 							});
 							await soShipAds.save({logging:(msg)=>{
 								log.debug(msg);
 							}}).then().catch(e=>{
 								log.error(e.message)
 							});	
 												
 						}
 					});
 				}).then(async (t) => {

 				}).catch(async (err) => {
 					log.error(err.message);
 					return await t.rollback();
 				});
 			});
 			
 			return true;
 			
 		}catch(e){
 			log.error(e.message);
 			return false;
 		}
 	}
 	rSalesOrder.prototype.getSeqNumberForModule=async function(mod,seqModule,reqStr='',reqNo='',log){
 		try{
 			var self=this;
 			var dbconn=this.getDb();
 			//select tabid from vtiger_tab where name=
 			return await dbconn.query("select prefix from vtiger_modentity_num where semodule=? and active = 1",{
 				type:QueryTypes.SELECT,
 				replacements:[seqModule],
 				logging:(msg)=>{
 					log.debug(msg);
 				}
 			}).spread(async (modentity)=>{
 				var prefix=modentity.prefix;
 				var tabid=await dbconn.query('select tabid from vtiger_tab where name=?',{
 					type:QueryTypes.SELECT,
 					replacements:[seqModule],
 					logging:(msg)=>{
 						log.debug(msg);
 					}
 				}).spread((tab)=>{
 					return tab.tabid;
 				});
 				var code= await dbconn.query("SELECT count(1) as `cnt` FROM vtiger_crmentity where setype_id=?",{
 					type:QueryTypes.SELECT,
 					replacements:[tabid],
 					logging:(msg)=>{
 						log.debug(msg);
 					}
 				}).spread((countRes)=>{
 					return countRes.cnt+1;
 				});
 				return prefix+code;
 			});
 			
 		}
 		catch(e){
 			log.error(e.message);
 			return false;
 		}
 	}
 	rSalesOrder.prototype.updateCrmRelEntity=async function(crmId,module,relCrmId,relModule,log){
 		var self=this;
 		const dbconn=this.getDb();
 		const CrmEntityRel=dbconn.import('./../../models/crmentity-rel');
 		var crmEntityRel=new CrmEntityRel();
 		crmEntityRel['crmid']=crmId;
 		crmEntityRel['module']=module;
 		crmEntityRel['relcrmid']=relCrmId;
 		crmEntityRel['relmodule']=relModule;
 		crmEntityRel.save({logging:(msg)=>{
 			log.debug(msg);
 			return true;
 		}});
 		
 	}
 	rSalesOrder.prototype.updateSoLineItems=async function(so,socf,rsoId,distId,log){
 		try{
 			var self=this;
 			const dbconn=this.getDb();
 			const SoProdRel=dbconn.import('./../../models/so-prod-rel');
 			const SaleXBatchInfo=dbconn.import('./../../models/sale-x-batch-info');
 			var xrsoProdLineItems=await self.getXrsoProdRel(rsoId);
 			var i=1;
 			var netTotalValue=0;
 			return await xrsoProdLineItems.reduce(async (promise, item) => {
 				await promise;
 				var soProdRel=new SoProdRel();
 				soProdRel['id']=so['salesorderid'];
 				soProdRel['productid']=item['productid'];
 				soProdRel['productcode']=item['productcode'];
 				soProdRel['sequence_no']=i;
 				soProdRel['quantity']=item['quantity'];
 				soProdRel['siqty']=item['siqty'];
 				soProdRel['tuom']=item['tuom'];
 				soProdRel['discount_percent']=item['discount_percent'];
 				soProdRel['xprodhierid']=item['xprodhierid'];
 				soProdRel['discount_amount']=item['discount_amount'];
 				soProdRel['baseqty']=item['baseqty'];
 				soProdRel['dispatchqty']=item['dispatchqty'];
 				soProdRel['listprice']=item['listprice'];
 				soProdRel['comment']=item['comment'];
 				soProdRel['description']=item['description'];
 				soProdRel['incrementondel']=item['incrementondel'];
 				soProdRel['tax1']=item['tax1'];
 				soProdRel['tax2']=item['tax2'];
 				soProdRel['tax3']=item['tax3'];
 				soProdRel['ptr']=item['ptr'];
 				soProdRel['mrp']=item['mrp'];
 				soProdRel['deleted']=0;
 				soProdRel.created_at=moment().format('YYYY-MM-DD HH:mm:ss');
 				soProdRel.modified_at=moment().format('YYYY-MM-DD HH:mm:ss');

 				soProdRel.save({logging:(msg)=>{
 					log.debug(msg);
 				}}).then(async function(soRel){


 						var total=await self.updateSoXRelInfo(so,socf,soRel,distId,log);
 						log.info("===================== tax calucation - start ==========")
 						
 						var taxAmount=await self.getProductTax(soRel['productid'],'xSalesOrder',distId,so['buyerid'],socf['cf_xrsalesorder_shipping_address_pick'],socf['cf_salesorder_sales_order_date'],log,soRel['lineitem_id'],total,so,soProdRel['baseqty']);
 						
 						if(taxAmount>0){
 							total=total+taxAmount;
 						}

 						if(typeof(netTotalValue)!='undefined'){
 							netTotalValue=netTotalValue+total;
 							so.total=netTotalValue;
 							so.subtotal=netTotalValue;
 							so.save({
 								logging:(msg)=>{
 									log.debug(msg);
 								}
 							}).then((res)=>{
 								log.info("total and subtotal saved");
 							}).catch(e=>{
 								log.error(" while saving the total and sub total "+e.message);
 							})
 						}
 						else{
 							netTotalValue=total;
 						}

 						log.info("===================== tax calucation - end ==========")
 					
 					
 					/*var sxbinfo=new SaleXBatchInfo();
 					sxbinfo['transaction_id']=soRel['id'];
 					sxbinfo['trans_line_id']=soRel['lineitem_id'];
 					sxbinfo['product_id']=soRel['productid'];
 					sxbinfo['pkd']='';
 					sxbinfo['expiry']='';
 					sxbinfo['transaction_type']='SO';
 					sxbinfo['sqty']=soRel['quantity'];
 					sxbinfo['sfqty']=0.000000;
 					sxbinfo['ptr']=soRel['ptr'];
 					sxbinfo['pts']=0.000000;
 					sxbinfo['mrp']=0.000000;
 					sxbinfo['ecp']=0.000000;
 					sxbinfo['reconcile']='';
 					sxbinfo['distributor_id']=distId;
 					var trackSerial=await self.getProductTrackSerial(soRel['productid'],log);
 					sxbinfo['track_serial']=trackSerial;
 					sxbinfo['created_at']=moment().format('YYYY-MM-DD HH:mm:ss');;
 					sxbinfo['modified_at']=moment().format('YYYY-MM-DD HH:mm:ss');;
 					sxbinfo['deleted']=0;
 					sxbinfo.save({logging:(msg)=>{
 						log.debug(msg);
 					}}).then(async function(sxBatchInfo){
 						var total=await self.updateSoXRelInfo(so,socf,soRel,sxBatchInfo,distId,log);
 						log.info("===================== tax calucation - start ==========")
 						
 						var taxAmount=await self.getProductTax(soRel['productid'],'xSalesOrder',distId,so['buyerid'],socf['cf_xrsalesorder_shipping_address_pick'],socf['cf_salesorder_sales_order_date'],log,soRel['lineitem_id'],total,so,soProdRel['baseqty']);
 						
 						if(taxAmount>0){
 							total=total+taxAmount;
 						}

 						if(typeof(netTotalValue)!='undefined'){
 							netTotalValue=netTotalValue+total;
 							so.total=netTotalValue;
 							so.subtotal=netTotalValue;
 							so.save({
 								logging:(msg)=>{
 									log.debug(msg);
 								}
 							}).then((res)=>{
 								log.info("total and subtotal saved");
 							}).catch(e=>{
 								log.error(" while saving the total and sub total "+e.message);
 							})
 						}
 						else{
 							netTotalValue=total;
 						}

 						log.info("===================== tax calucation - end ==========")
 					}).catch(e=>{
 						log.error(e.message);
 						
 					});*/
 				}).catch(e=>{
 					log.error(e.message);
 					return false;
 				});
 			}, Promise.resolve());
 		}catch(e){
 			return false;
 		}
 	}
 	rSalesOrder.prototype.getProductTax=async function(productId,module,distId,buyerId,shippingAddressId,transactionDate,log,lineItemId,netTotal,so,baseqty){
 		
 		try{
 			var self=this;
 			var dbconn=this.getDb();
 			var ALLOW_GST_TRANSACTION= await self.getInvMgtConfig('ALLOW_GST_TRANSACTION');
 			if(Number(ALLOW_GST_TRANSACTION)==1 || ALLOW_GST_TRANSACTION.toLowerCase()=='true'){
	 			var retailerTaxType=await dbconn.query("SELECT vtiger_xretailer.retailertaxtype FROM vtiger_xretailer where vtiger_xretailer.xretailerid=? and vtiger_xretailer.deleted=0",{
	 					type:QueryTypes.SELECT,
	 					replacements:[buyerId],
	 					logging:(msg)=>{
	 						log.debug(msg);
	 					}
	 				}).spread((retailer)=>{
	 					return retailer.retailertaxtype;
	 				}).catch(e=>{
	 					log.error(e.message);
	 					return false;
	 				});
	 			if(transactionDate!=''){
	 				var txnDate=transactionDate;
	 			}
	 			else{
	 				var txnDate=moment().format('YYYY-MM-DD');
	 			}
	 			var productTaxType=await dbconn.query("SELECT producttaxtype FROM vtiger_xproduct where 	producttaxtype='Taxable' AND xproductid=?",{

	 					type:QueryTypes.SELECT,
	 					replacements:[productId],
	 					logging:(msg)=>{
	 						log.debug(msg);
	 					}
	 				}).spread((product)=>{
	 					return product.producttaxtype;
	 				}).catch(e=>{
	 					log.error(e.message);
	 					return false;
	 				});
	 			var distTaxType=await dbconn.query("SELECT xdistributorid,distributortaxtype FROM vtiger_xdistributor where distributortaxtype='Registered' AND xdistributorid=?",{
	 					type:QueryTypes.SELECT,
	 					replacements:[distId],
	 					logging:(msg)=>{
	 						log.debug(msg);
	 					}
	 				}).spread((dist)=>{
	 					return dist.distributortaxtype;
	 				}).catch(e=>{
	 					log.error(e.message);
	 					return false;
	 				});
	 			var buyerOrSellerId=await dbconn.query("SELECT reference_id FROM vtiger_xreceivecustomermaster where xreceivecustomermasterid=?",{
	 					type:QueryTypes.SELECT,
	 					replacements:[buyerId],
	 					logging:(msg)=>{
	 						log.debug(msg);
	 					}
	 				}).spread((cust)=>{
	 					if(cust){
	 						return cust.reference_id;
	 					}
	 					else{
	 						return buyerId;
	 					}
	 				}).catch(e=>{
	 					log.error(e.message);
	 					return buyerId;
	 				});
	 			var distStateId=await dbconn.query("SELECT cf_xdistributor_state FROM vtiger_xdistributorcf INNER JOIN vtiger_xdistributor ON vtiger_xdistributor.xdistributorid=vtiger_xdistributorcf.xdistributorid where vtiger_xdistributor.gstinno!='' AND vtiger_xdistributorcf.xdistributorid=?",{
	 					type:QueryTypes.SELECT,
	 					replacements:[distId],
	 					logging:(msg)=>{
	 						log.debug(msg);
	 					}
	 				}).spread((dist)=>{
	 					return dist.cf_xdistributor_state;
	 				}).catch(e=>{
	 					log.error(e.message);
	 					return false;
	 				});
	 			var retailerStateId= await dbconn.query("SELECT xState.xstateid from vtiger_xaddress xAdd INNER JOIN vtiger_xstate xState on xState.xstateid=xAdd.xstateid where xAdd.xaddressid=?",{
	 					type:QueryTypes.SELECT,
	 					replacements:[shippingAddressId],
	 					logging:(msg)=>{
	 						log.debug(msg);
	 					}
	 				}).spread(async(state)=>{
	 					if(state){
	 						return state.xstateid;
	 					}
	 					else{
	 						return await dbconn.query("SELECT vtiger_xretailercf.cf_xretailer_state FROM vtiger_xretailercf where vtiger_xretailercf.xretailerid=?",{
	 							type:QueryTypes.SELECT,
	 							replacements:[buyerOrSellerId],
	 							logging:(msg)=>{
	 								log.debug(msg)
	 							}
	 						}).spread((state)=>{
	 								return state.cf_xretailer_state
	 						})
	 					}
	 				}).catch(e=>{
	 					log.error(e.message);
	 					return false;
	 				});
	 			if(distStateId!=false && retailerStateId!=false){
	 				
	 				//AND vtiger_xtaxcf.cf_xtax_status='Approved' AND (vtiger_xtax.form_type='' OR vtiger_xtax.form_type is NULL)
	 				if(distStateId==retailerStateId){
	 					var taxTypeToApply='LST';
	 				}
	 				else{
	 					var taxTypeToApply='CST';
	 				}
	 				var productTaxDetails=await dbconn.query("SELECT vtiger_xtaxmapping.xtaxmappingid,vtiger_xtax.xtaxid,vtiger_xtax.taxcode,vtiger_xtax.taxdescription,vtiger_xtax.tax_on_uom_flag,vtiger_xtax.tax_on_uom,vtiger_xtax.display_percentage_intra,vtiger_xtax.display_percentage_inter,vtiger_xtaxmappingcf.tax_apply_type,vtiger_xtaxcf.cf_xtax_lst_percentage,vtiger_xtaxcf.cf_xtax_cst_percentage,vtiger_xtaxmappingcf.incremental_flag,vtiger_xtaxmappingcf.cf_xtaxmapping_product,vtiger_xtaxmappingcf.cf_xtaxmapping_product_hierachy,'Product' as taxapplytype,vtiger_xtaxcf.lst_tax_group,vtiger_xtaxcf.cst_tax_group, CASE WHEN vtiger_xtax.tax_on_uom = 'Base UOM' THEN vtiger_xproductcf.cf_xproduct_base_uom WHEN vtiger_xtax.tax_on_uom = 'UOM1' THEN vtiger_xproductcf.cf_xproduct_uom1 WHEN vtiger_xtax.tax_on_uom = 'UOM2' THEN vtiger_xproductcf.cf_xproduct_uom2 ELSE '' END as product_uom, CASE WHEN vtiger_xtax.tax_on_uom = 'Base UOM' THEN 1 WHEN vtiger_xtax.tax_on_uom = 'UOM1' THEN vtiger_xproductcf.cf_xproduct_uom1_conversion WHEN vtiger_xtax.tax_on_uom = 'UOM2' THEN vtiger_xproductcf.cf_xproduct_uom2_conversion ELSE '' END as uom_conversion, vtiger_xproductcf.cf_xproduct_base_uom,vtiger_xproductcf.cf_xproduct_conversion_factor, vtiger_xproductcf.cf_xproduct_uom1,vtiger_xproductcf.cf_xproduct_uom1_conversion, vtiger_xproductcf.cf_xproduct_uom2,vtiger_xproductcf.cf_xproduct_uom2_conversion FROM vtiger_xtaxmapping inner join vtiger_xtaxmappingcf on vtiger_xtaxmappingcf.xtaxmappingid=vtiger_xtaxmapping.xtaxmappingid inner join vtiger_xtax on vtiger_xtax.xtaxid=vtiger_xtaxmappingcf.cf_xtaxmapping_sales_tax inner join vtiger_xtaxcf on vtiger_xtaxcf.xtaxid=vtiger_xtax.xtaxid inner join vtiger_xproductcf on vtiger_xproductcf.xproductid = vtiger_xtaxmappingcf.cf_xtaxmapping_product where vtiger_xtaxmapping.deleted=0 and vtiger_xtaxmappingcf.cf_xtaxmapping_product=? and vtiger_xtaxmapping.statename=? and vtiger_xtaxcf.cf_xtax_active=1 AND vtiger_xtaxmappingcf.cf_xtaxmapping_active=1 and ( DATE(vtiger_xtaxmappingcf.cf_xtaxmapping_from_date) <= ? and (vtiger_xtaxmappingcf.cf_xtaxmapping_to_date is NULL or DATE(vtiger_xtaxmappingcf.cf_xtaxmapping_to_date) >= ?) ) AND vtiger_xtaxcf.cf_xtax_status='Approved' AND (vtiger_xtax.form_type='' OR vtiger_xtax.form_type is NULL) ORDER BY vtiger_xtaxmapping.modified_at DESC",{
	 						type:QueryTypes.SELECT,
	 						replacements:[productId,retailerStateId,txnDate,txnDate],
	 						logging:(msg)=>{
	 							log.info("***************** getProductTax *****************")
	 							log.debug(msg);
	 						}
	 					}).then(async (productTax)=>{
	 						
	 						if(productTax.length>0){
	 							return productTax;
	 						}
	 						else{
	 							var product=await dbconn.query("SELECT vtiger_xproductcf.cf_xproduct_category,vtiger_xproduct.hsncode FROM vtiger_xproduct INNER JOIN vtiger_xproductcf on vtiger_xproductcf.xproductid=vtiger_xproduct.xproductid WHERE vtiger_xproduct.xproductid = ?",{
	 								type:QueryTypes.SELECT,
	 								replacements:[productId],
	 								logging:(msg)=>{
	 									log.info("Getting the product hsncode and category");
	 									log.debug(msg)
	 								}
	 							}).spread((product)=>{
	 								return product;
	 							}).catch(e=>{
	 								log.error("Error while getting the product details "+e.message);
	 								return false;
	 							});
	 							if(product){
	 								var hsncode=product.hsncode;
	 								var cf_xproduct_category=product.cf_xproduct_category;
	 								log.info("Prod hier Tax")
	 								var productTaxDetails= await self.getProdHierTax(cf_xproduct_category,'cf_xtaxmapping_sales_tax',retailerStateId,'','',hsncode,'',txnDate,productId,log);
	 								
	 								if(productTaxDetails){
	 									if(productTaxDetails.length>0){
	 										return productTaxDetails;
	 									}
	 									else{
	 										
	 										return await self.getProdIndTax(productId,cf_xproduct_category,hsncode,'cf_xtaxmapping_sales_tax','',taxTypeToApply,'','',txnDate,0,0,retailerTaxType,log)
	 									
	 									}
	 									
	 								}
	 								else{
	 									log.info("**** indian tax ******");
	 									return await self.getProdIndTax(productId,cf_xproduct_category,hsncode,'cf_xtaxmapping_sales_tax','',taxTypeToApply,'','',txnDate,0,0,retailerTaxType,log)
	 									
	 								}

	 							}

	 						}
	 					});
	 					taxAmount=0.00;
	 					taxValue=0.00;
	 					await productTaxDetails.reduce(async(promise,tax)=>{
	 						await promise;
	 						var XtaxRelSo=dbconn.import('./../../models/x-tax-rel-so');
	 						var xtaxRelSo=new XtaxRelSo();
	 						var taxOnUomFlag=tax.tax_on_uom_flag;
	 						var uomConversion=(tax.uom_conversion)?tax.uom_conversion:1;
	 						if(taxTypeToApply=='LST'){
	 							var percentage=tax.cf_xtax_lst_percentage;
	 							var basePercentage=tax.cf_xtax_lst_percentage/uomConversion;
	 							var taxGroupType=tax.lst_tax_group;
	 						}
	 						else{
	 							var percentage=tax.cf_xtax_cst_percentage;
	 							var basePercentage=tax.cf_xtax_cst_percentage/uomConversion;
	 							var taxGroupType=tax.cst_tax_group;
	 						}
	 						var LBL_TAX_CONFIGURATION=await self.getInvMgtConfig('LBL_TAX_CONFIGURATION');
	 						if(LBL_TAX_CONFIGURATION=='1' && taxOnUomFlag==1){
	 							var taxPercentage=basePercentage;
	 						}
	 						else{
	 							var taxPercentage=percentage;
	 							var taxOnUomFlag=0;
	 						}
	 						if(taxOnUomFlag==1){
	 							var taxAmount=await (Number(baseqty)*Number(taxPercentage));
	 						}
	 						else{
	 							var taxAmount=await (Number(netTotal)*Number(taxPercentage)/100); 
	 						}
	 						taxValue=taxValue+taxAmount;
	 						xtaxRelSo['transaction_id']=so['salesorderid'];
	 						xtaxRelSo['lineitem_id']=productId;
	 						xtaxRelSo['transaction_name']='xSalesOrder';
	 						xtaxRelSo['tax_type']=(tax.taxcode?tax.taxcode:'');
	 						xtaxRelSo['tax_label']=tax.taxdescription;
	 						xtaxRelSo['tax_percentage']=taxPercentage;
	 						xtaxRelSo['tax_amt']=taxAmount;
	 						xtaxRelSo['taxable_amt']=netTotal;
	 						xtaxRelSo['transaction_line_id']=lineItemId;
	 						xtaxRelSo['xtaxid']=tax.xtaxid;
	 						xtaxRelSo['tax_group_type']=taxGroupType;
	 						xtaxRelSo['created_at']=moment().format('YYYY-MM-DD HH:mm:ss');
	 						xtaxRelSo['modified_at']=moment().format('YYYY-MM-DD HH:mm:ss');
	 						xtaxRelSo['tax_on_uom_flag']=taxOnUomFlag;
	 						xtaxRelSo['tax_display_percentage']=(tax.display_percentage_intra?tax.display_percentage_intra:taxPercentage);
	 						xtaxRelSo.save({logging:(msg)=>{
	 							log.debug(msg);
	 						}}).then(xtax=>{
	 							log.info(" sify xtransaction rel so table save complete");
	 						}).catch(e=>{
	 							log.error(" sify xtransaction rel so table error "+ e.message);
	 						});
	 					},Promise.resolve());

	 					return taxValue;    
	 			}
	 			else{
	 				return false;
	 			}
 			}
 			else{
 				return false;
 			}
 		}
 		catch(e){
 			log.error(e.message);
 			return false;
 		}

 	}
 	rSalesOrder.prototype.getProdHierTax=async function(prodCat,taxToRetrive,retStateId,amenId,invDate,hsncode,limit,txnDate,productId,log){
 		try{
 			var self=this;
 			var dbconn=this.getDb();
 			return await dbconn.query("SELECT  vtiger_xtaxmapping.xtaxmappingid,vtiger_xtax.xtaxid,vtiger_xtax.taxcode,vtiger_xtax.taxdescription,vtiger_xtax.tax_on_uom_flag,vtiger_xtax.tax_on_uom,vtiger_xtax.display_percentage_intra,vtiger_xtax.display_percentage_inter,vtiger_xtaxmappingcf.tax_apply_type,vtiger_xtaxcf.cf_xtax_lst_percentage,vtiger_xtaxcf.cf_xtax_cst_percentage,vtiger_xtaxmappingcf.incremental_flag,vtiger_xtaxmappingcf.cf_xtaxmapping_product,vtiger_xtaxmappingcf.cf_xtaxmapping_product_hierachy,'Hierachy' as taxapplytype,vtiger_xtaxcf.lst_tax_group,vtiger_xtaxcf.cst_tax_group, CASE			WHEN vtiger_xtax.tax_on_uom = 'Base UOM' THEN vtiger_xproductcf.cf_xproduct_base_uom			WHEN vtiger_xtax.tax_on_uom = 'UOM1' THEN vtiger_xproductcf.cf_xproduct_uom1			WHEN vtiger_xtax.tax_on_uom = 'UOM2' THEN vtiger_xproductcf.cf_xproduct_uom2			ELSE ''			END as product_uom,			CASE 			WHEN vtiger_xtax.tax_on_uom = 'Base UOM' THEN 1			WHEN vtiger_xtax.tax_on_uom = 'UOM1' THEN vtiger_xproductcf.cf_xproduct_uom1_conversion			WHEN vtiger_xtax.tax_on_uom = 'UOM2' THEN vtiger_xproductcf.cf_xproduct_uom2_conversion			ELSE ''			END as uom_conversion,			vtiger_xproductcf.cf_xproduct_base_uom,vtiger_xproductcf.cf_xproduct_conversion_factor,			vtiger_xproductcf.cf_xproduct_uom1,vtiger_xproductcf.cf_xproduct_uom1_conversion,			vtiger_xproductcf.cf_xproduct_uom2,vtiger_xproductcf.cf_xproduct_uom2_conversion FROM vtiger_xtaxmapping			inner join vtiger_xtaxmappingcf on vtiger_xtaxmappingcf.xtaxmappingid=vtiger_xtaxmapping.xtaxmappingid	inner join vtiger_xtax on vtiger_xtax.xtaxid=vtiger_xtaxmappingcf.cf_xtaxmapping_sales_tax inner join vtiger_xtaxcf on vtiger_xtaxcf.xtaxid=vtiger_xtax.xtaxid inner join vtiger_xproductcf on vtiger_xproductcf.xproductid =? where vtiger_xtaxmapping.deleted=0 AND vtiger_xtaxmappingcf.cf_xtaxmapping_product=0 and vtiger_xtaxmappingcf.cf_xtaxmapping_product_hierachy=? and vtiger_xtaxmapping.statename=? and vtiger_xtaxcf.cf_xtax_active=1 AND vtiger_xtaxmappingcf.cf_xtaxmapping_active=1 and ( DATE(vtiger_xtaxmappingcf.cf_xtaxmapping_from_date) <= ? and (vtiger_xtaxmappingcf.cf_xtaxmapping_to_date is NULL or DATE(vtiger_xtaxmappingcf.cf_xtaxmapping_to_date) >= ?) ) AND vtiger_xtaxcf.cf_xtax_status='Approved' AND (vtiger_xtax.form_type='' OR vtiger_xtax.form_type is NULL) ORDER BY vtiger_xtaxmapping.modified_at DESC",{
 				type:QueryTypes.SELECT,
 				replacements:[productId,prodCat,retStateId,txnDate,txnDate],
 				logging:(msg)=>{
 					log.info("*****************getProdHierTax 1************")
 					log.debug(msg);
 				}
 			}).then(async(productTaxDetails)=>{
 				if(productTaxDetails){
 					if(productTaxDetails.length>0){
 						log.info("tax present prodct category")
 						return productTaxDetails;
 					}
 				}
 				else{
 					
 					var prodParentCat=await dbconn.query("SELECT cf_xprodhier_parent FROM vtiger_xprodhiercf WHERE cf_xprodhier_active=1 AND cf_xprodhier_parent!=0 AND xprodhierid = ?",{
 						type:QueryTypes.SELECT,
 						replacements:[prodCat],
 						logging:(msg)=>{
 							log.debug(msg)
 						}
 					}).spread(async(categoryDetails)=>{
 						if(categoryDetails){
 							log.info("*****************getProdHierTax category based************")
 							return await self.getProdHierTax(categoryDetails.cf_xprodhier_parent,taxToRetrive,retStateId,'','',hsncode,'',txnDate,productId,log);
 							
 						}
 						else{
 							if(hsncode!=''){
 								return await dbconn.query("SELECT  vtiger_xtaxmapping.xtaxmappingid,vtiger_xtax.xtaxid,vtiger_xtax.taxcode,vtiger_xtax.taxdescription,vtiger_xtax.tax_on_uom_flag,vtiger_xtax.tax_on_uom,vtiger_xtax.display_percentage_intra,vtiger_xtax.display_percentage_inter,vtiger_xtaxmappingcf.tax_apply_type,vtiger_xtaxcf.cf_xtax_lst_percentage,vtiger_xtaxcf.cf_xtax_cst_percentage,vtiger_xtaxmappingcf.incremental_flag,vtiger_xtaxmappingcf.cf_xtaxmapping_product,vtiger_xtaxmappingcf.cf_xtaxmapping_product_hierachy,'HSNCode' as taxapplytype,vtiger_xtaxcf.lst_tax_group,vtiger_xtaxcf.cst_tax_group, CASE			WHEN vtiger_xtax.tax_on_uom = 'Base UOM' THEN vtiger_xproductcf.cf_xproduct_base_uom			WHEN vtiger_xtax.tax_on_uom = 'UOM1' THEN vtiger_xproductcf.cf_xproduct_uom1			WHEN vtiger_xtax.tax_on_uom = 'UOM2' THEN vtiger_xproductcf.cf_xproduct_uom2			ELSE ''			END as product_uom,			CASE 			WHEN vtiger_xtax.tax_on_uom = 'Base UOM' THEN 1			WHEN vtiger_xtax.tax_on_uom = 'UOM1' THEN vtiger_xproductcf.cf_xproduct_uom1_conversion			WHEN vtiger_xtax.tax_on_uom = 'UOM2' THEN vtiger_xproductcf.cf_xproduct_uom2_conversion			ELSE ''			END as uom_conversion,			vtiger_xproductcf.cf_xproduct_base_uom,vtiger_xproductcf.cf_xproduct_conversion_factor,			vtiger_xproductcf.cf_xproduct_uom1,vtiger_xproductcf.cf_xproduct_uom1_conversion,			vtiger_xproductcf.cf_xproduct_uom2,vtiger_xproductcf.cf_xproduct_uom2_conversion FROM vtiger_xtaxmapping inner join vtiger_xtaxmappingcf on vtiger_xtaxmappingcf.xtaxmappingid=vtiger_xtaxmapping.xtaxmappingid	inner join vtiger_xtax on vtiger_xtax.xtaxid=vtiger_xtaxmappingcf.cf_xtaxmapping_sales_tax inner join vtiger_xtaxcf on vtiger_xtaxcf.xtaxid=vtiger_xtax.xtaxid inner join vtiger_xproductcf on vtiger_xproductcf.xproductid =? where vtiger_xtaxmapping.deleted=0 AND vtiger_xtaxmapping.hsncode=? AND vtiger_xtaxmapping.statename=? AND vtiger_xtaxcf.cf_xtax_active=1 AND vtiger_xtaxmappingcf.cf_xtaxmapping_active=1 AND ( DATE(vtiger_xtaxmappingcf.cf_xtaxmapping_from_date) <= ? and (vtiger_xtaxmappingcf.cf_xtaxmapping_to_date is NULL or DATE(vtiger_xtaxmappingcf.cf_xtaxmapping_to_date) >= ?))  AND vtiger_xtaxcf.cf_xtax_status='Approved' AND (vtiger_xtax.form_type='' OR vtiger_xtax.form_type is NULL) ORDER BY vtiger_xtaxmapping.modified_at DESC ",{
 									type:QueryTypes.SELECT,
 									replacements:[productId,hsncode,retStateId,txnDate,txnDate],
 									logging:(msg)=>{
 										log.info("tax calucation in getProdHierTax based on hsncode");
 										log.debug(msg);
 									}
 								}).then(async(productTaxDetails)=>{
 									if(productTaxDetails){
 										if(productTaxDetails.length>0){
 											
 											return productTaxDetails;
 										}
 										else{
 											return false;

 										}
 									}
 									else{
 										return false;
 									}
 									
 									
 									
 								}).catch(e=>{
 									log.error("Got it in getProdHierTax "+e.message);
 									return false;
 								});
 							}
 							else{
 								return false;
 							}
 						}
 					})
 				}
 			})
 		}
 		catch(e){
 			log.error("Error in getProdHierTax:"+e.message)
 		}
 	}
 	rSalesOrder.prototype.getProdIndTax=async function(productId,prodCat,hsncode,taxToRetrive,invDate,taxapplytype,amenId,limit,txnDate,level,moduleFrom,retailerTaxType,log){
 		try{
 			log.info("We are in get getProdIndTax function");
 			var self=this;
 			var dbconn=this.getDb();
 			var where="vtiger_xtaxmapping.deleted=0 AND vtiger_xtaxcf.cf_xtax_active=1 AND vtiger_xtaxmappingcf.cf_xtaxmapping_active=1 AND vtiger_xstate.is_allstate=1";
 			var uomType=", CASE WHEN vtiger_xtax.tax_on_uom = 'Base UOM' THEN vtiger_xproductcf.cf_xproduct_base_uom		WHEN vtiger_xtax.tax_on_uom = 'UOM1' THEN vtiger_xproductcf.cf_xproduct_uom1 WHEN vtiger_xtax.tax_on_uom = 'UOM2' THEN vtiger_xproductcf.cf_xproduct_uom2 ELSE '' END as product_uom,		CASE WHEN vtiger_xtax.tax_on_uom = 'Base UOM' THEN 1 WHEN vtiger_xtax.tax_on_uom = 'UOM1' THEN vtiger_xproductcf.cf_xproduct_uom1_conversion WHEN vtiger_xtax.tax_on_uom = 'UOM2' THEN vtiger_xproductcf.cf_xproduct_uom2_conversion ELSE '' END as uom_conversion,		vtiger_xproductcf.cf_xproduct_base_uom,vtiger_xproductcf.cf_xproduct_conversion_factor,		vtiger_xproductcf.cf_xproduct_uom1,vtiger_xproductcf.cf_xproduct_uom1_conversion,		vtiger_xproductcf.cf_xproduct_uom2,vtiger_xproductcf.cf_xproduct_uom2_conversion";
 			var product="inner join vtiger_xproductcf on vtiger_xproductcf.xproductid = "+productId;
 			if(productId!='' && level==0){
 				where=where+" AND vtiger_xtaxmappingcf.cf_xtaxmapping_product='"+productId+"'";
 			}
 			else if(prodCat!='' && level==1){
 				where=where+" AND vtiger_xtaxmappingcf.cf_xtaxmapping_product_hierachy='"+prodCat+"'";
 			}
 			else if(hsncode!='' && level==3){
 				where=where+" AND vtiger_xtaxmapping.hsncode='"+hsncode+"'";
 			}
 			if(amenId!=''){
 				where=where+" and ( DATE(vtiger_xtaxmappingcf.cf_xtaxmapping_from_date) <= '"+invDate+"' and (vtiger_xtaxmappingcf.cf_xtaxmapping_to_date is NULL or DATE(vtiger_xtaxmappingcf.cf_xtaxmapping_to_date) >= '"+invDate+"') ) AND vtiger_xtaxcf.cf_xtax_status='Approved' ORDER BY vtiger_xtaxmapping.modified_at DESC";
 			}
 			else{
 				 where=where+"  and ( DATE(vtiger_xtaxmappingcf.cf_xtaxmapping_from_date) <= '"+txnDate+"' and (vtiger_xtaxmappingcf.cf_xtaxmapping_to_date is NULL or DATE(vtiger_xtaxmappingcf.cf_xtaxmapping_to_date) >= '"+txnDate+"') ) AND vtiger_xtaxcf.cf_xtax_status='Approved' ORDER BY vtiger_xtaxmapping.modified_at DESC"
 			}
 			var indTax=" vtiger_xtaxmappingcf.incremental_flag=1 AND (vtiger_xtax.form_type='' OR vtiger_xtax.form_type is NULL) AND ";
 			
 			var checkQuery="SELECT vtiger_xtaxmapping.xtaxmappingid,vtiger_xtax.xtaxid,vtiger_xtax.taxcode,vtiger_xtax.taxdescription,vtiger_xtax.tax_on_uom_flag,vtiger_xtax.tax_on_uom,vtiger_xtax.display_percentage_intra,vtiger_xtax.display_percentage_inter,vtiger_xtaxmappingcf.tax_apply_type,vtiger_xtaxcf.cf_xtax_lst_percentage,vtiger_xtaxcf.cf_xtax_cst_percentage,vtiger_xtaxmappingcf.incremental_flag,vtiger_xtaxmappingcf.cf_xtaxmapping_product,vtiger_xtaxmappingcf.cf_xtaxmapping_product_hierachy,vtiger_xtaxcf.lst_tax_group,vtiger_xtaxcf.cst_tax_group "+uomType+" FROM vtiger_xtaxmapping inner join vtiger_xtaxmappingcf on vtiger_xtaxmappingcf.xtaxmappingid=vtiger_xtaxmapping.xtaxmappingid inner join vtiger_xtax on vtiger_xtax.xtaxid=vtiger_xtaxmappingcf.cf_xtaxmapping_sales_tax inner join vtiger_xtaxcf on vtiger_xtaxcf.xtaxid=vtiger_xtax.xtaxid inner join vtiger_xstate on vtiger_xstate.xstateid=vtiger_xtaxmapping.statename "+product+"  where "+indTax+" "+where;
 			log.info(checkQuery);
 			var noOfRows=await dbconn.query(checkQuery,{
 					type:QueryTypes.SELECT,
 					logging:(msg)=>{
 						log.info("************** check querygetProdIndTax ********* level: "+level)
 						log.debug(msg);
 					}
 				}).then(async(checkResult)=>{
 					return checkResult.length;
 				}).catch(e=>{
 					log.error(e.message);
 					return 0;
 				});
 			
 			var fromWhere='';
 			if(noOfRows==0){
 				fromWhere =" (vtiger_xtax.form_type='' OR vtiger_xtax.form_type is NULL) AND ";
 			}
 			var mainTaxQuery="SELECT  vtiger_xtaxmapping.xtaxmappingid,vtiger_xtax.xtaxid,vtiger_xtax.taxcode,vtiger_xtax.taxdescription,vtiger_xtax.tax_on_uom_flag,vtiger_xtax.tax_on_uom,vtiger_xtax.display_percentage_intra,vtiger_xtax.display_percentage_inter,vtiger_xtaxmappingcf.tax_apply_type,vtiger_xtaxcf.cf_xtax_lst_percentage,vtiger_xtaxcf.cf_xtax_cst_percentage,vtiger_xtaxmappingcf.incremental_flag,vtiger_xtaxmappingcf.cf_xtaxmapping_product,vtiger_xtaxmappingcf.cf_xtaxmapping_product_hierachy,vtiger_xtaxcf.lst_tax_group,vtiger_xtaxcf.cst_tax_group "+uomType+" FROM vtiger_xtaxmapping inner join vtiger_xtaxmappingcf on vtiger_xtaxmappingcf.xtaxmappingid=vtiger_xtaxmapping.xtaxmappingid inner join vtiger_xtax on vtiger_xtax.xtaxid=vtiger_xtaxmappingcf.cf_xtaxmapping_sales_tax inner join vtiger_xtaxcf on vtiger_xtaxcf.xtaxid=vtiger_xtax.xtaxid inner join vtiger_xstate on vtiger_xstate.xstateid=vtiger_xtaxmapping.statename "+product+" where "+fromWhere+" "+where;  
		
 			var productTaxDetails= await dbconn.query(mainTaxQuery,{
 					type:QueryTypes.SELECT,
 					logging:(msg)=>{
 						log.info("************** tax getProdIndTax ********* level: "+level);
 						log.debug(msg);
 					}
 				}).then(async(taxDetails)=>{
 					if(taxDetails){
 						if(taxDetails.length>0){
 							return taxDetails;
 						}
 					}
 					else if(level!=2){
 						if(level==0){
 							return await self.getProdIndTax(productId,prodCat,hsncode,'cf_xtaxmapping_sales_tax',invDate,taxapplytype,'','',txnDate,1,moduleFrom,retailerTaxType,log);
 						}
 						else{
 							var parentCategory=await dbconn.query("SELECT cf_xprodhier_parent FROM vtiger_xprodhiercf WHERE cf_xprodhier_active=1 AND cf_xprodhier_parent!=0 AND xprodhierid = ?",{
 									type:QueryTypes.SELECT,
 									replacements:[prodCat],
 									logging:(msg)=>{
 										log.debug(msg);
 									}
 								}).spread(async(cat)=>{
 									return cat;
 								}).catch(e=>{
 									log.error("with selection of cf_xprodhier_parent query in getProdIndTax fuction");
 									return false;
 								});
 							if(parentCategory!=false){
 								return await self.getProdIndTax(productId,parentCategory.cf_xprodhier_parent,hsncode,'cf_xtaxmapping_sales_tax',invDate,taxapplytype,'','',txnDate,1,moduleFrom,retailerTaxType,log);	
 							}
 							else{
 								if(hsncode!=''){
 									return await self.getProdIndTax(productId,prodCat,hsncode,'cf_xtaxmapping_sales_tax',invDate,taxapplytype,'','',txnDate,2,moduleFrom,retailerTaxType,log);
 								}
 							}
 						}
 					}
 				}).catch(e=>{
 					log.error(e.message);
 					return false;
 				});
 				return productTaxDetails;

 		}
 		catch(e){
 		
 			log.error(e.message);
 			return false;
 		}
 	}
 	rSalesOrder.prototype.updateSoXRelInfo=async function(so,socf,sorel,distId,log){
 		var self=this;
 		const dbconn=this.getDb();
 		const ALLOW_GST_TRANSACTION=await self.getInvMgtConfig('ALLOW_GST_TRANSACTION');
 		if(ALLOW_GST_TRANSACTION){
 			var netTotal = 0;
 			if(Number(sorel['listprice']) > 0 && Number(sorel['quantity']) > 0){
 				netTotal=Number(sorel['listprice'])*Number(sorel['quantity']);
 			}
 			if(Number(sorel['discount_amount'])>0 && netTotal>=Number(sorel['discount_amount'])){
 				netTotal=netTotal-Number(sorel['discount_amount']);
 			}
 			if(Number(sorel['discount_percent'])>0 && netTotal>=Number(sorel['discount_percent']) && Number(sorel['discount_percent'])<100) {
 				netTotal=netTotal-(netTotal*(Number(sorel['discount_percent'])/100));
 			}
 			else if (Number(sorel['discount_percent'])>0 && Number(sorel['discount_percent'])>=100){
 				netTotal=netTotal-(netTotal*(Number(sorel['discount_percent'])/100));
 			}
 			return netTotal;

 		}
 	}
 	rSalesOrder.prototype.prepareSo=async function(soId,rso,rsocf,distId,custType,log){
 		var self=this;
 		const dbconn=this.getDb();
 		const SalesOrder=dbconn.import('./../../models/salesorder');
 		const SalesOrderCf=dbconn.import('./../../models/salesorder-cf');
 		
 		so=new SalesOrder();
 		so['salesorder_no']=await self.getSeqNumberForModule('increment','xSalesOrder','','',log);
 		so['salesorderid']=soId;
 		so['subject']=rso['subject'];
 		so['type']=rso['type'];
 		so['duedate']=rso['duedate'];
 		so['contactid']=rso['contactid'];
 		so['exciseduty']=Number(rso['exciseduty']);
 		so['salescommission']=Number(rso['salescommission']);
 		so['terms_conditions']=rso['terms_conditions'];
 		so['currency_id']=rso['currency_id'];
 		so['conversion_rate']=rso['conversion_rate'];
 		so['tracking_no']=rso['tracking_no'];
 		so['carrier']=rso['carrier'];
 		so['deleted']=0;
 		if(Number(custType)==1){
 			var buyerId=await self.getCustomerRefId(rso['buyerid'],log);
 				log.info("Buyer Id in so :"+buyerId);
 				if(buyerId==false || typeof(buyerId)=='undefined'|| buyerId=='undefined'){
 					buyerId=rso['buyerid'];
 						so['buyerid']=rso['buyerid'];
 					}
 					else{
 						buyerId=rso['buyerid'];
 						so['buyerid']=buyerId;
 				}
 		}
 		else{
 			buyerId=rso['buyerid'];
 			so['buyerid']=rso['buyerid'];
 		}
		//get the receive customer master - reference id for buyer id
	/*	*/
		
		
		
		so['created_at']=moment().format('YYYY-MM-DD HH:mm:ss');
 		so['modified_at']=moment().format('YYYY-MM-DD HH:mm:ss');
		so['requisition_no']=rso['requisition_no'];
		so['tracking_no']=rso['tracking_no'];
		so['adjustment']=Number(rso['adjustment']);
		so['total']=rso['total'];
		so['taxtype']=rso['taxtype'];
		so['discount_percent']=Number(rso['discount_percent']);
		so['discount_amount']=rso['discount_amount'];
		so['s_h_amount']=rso['s_h_amount'];
		so['is_taxfiled']=0;

		so['so_lbl_save_pro_cate']=await self.getInvMgtConfig('SO_LBL_SAVE_PRO_CATE');
		var SO_LBL_TAX_OPTION_ENABLE= await self.getInvMgtConfig('SO_LBL_TAX_OPTION_ENABLE');
		if(SO_LBL_TAX_OPTION_ENABLE.toLowerCase()!="true"){
			so['taxtype']='individual';
		}
		log.info("address1:"+buyerId);
		var soBillAds=await self.prepareBillAds(soId,buyerId,log);
		soBillAds['created_at']=moment().format('YYYY-MM-DD HH:mm:ss');
		soBillAds['modified_at']=moment().format('YYYY-MM-DD HH:mm:ss');
		soBillAds['deleted']=0;
		var soShipAds=await self.prepareShipAds(soId,buyerId,log);
		soShipAds['created_at']=moment().format('YYYY-MM-DD HH:mm:ss');
		soShipAds['modified_at']=moment().format('YYYY-MM-DD HH:mm:ss');
		soShipAds['deleted']=0;


 		//preparing the socf table 
 		var socf=new SalesOrderCf();
 		socf['salesorderid']=soId;
 		socf['cf_salesorder_sales_order_date']=rsocf['cf_salesorder_sales_order_date'];
 		socf['cf_xsalesorder_beat']=rsocf['cf_xrso_beat'];
 		socf['cf_xsalesorder_sales_man']=rsocf['cf_xrso_sales_man'];
 		if(typeof(rsocf['cf_xrso_credit_term'])==null || rsocf['cf_xrso_credit_term']=='' ||rsocf['cf_xrso_credit_term']==null){
 			var creditTerm=await self.getCreditTerm(rso['buyerid'],log);
 			socf['cf_xsalesorder_credit_term']=creditTerm;
 		}
 		
 		socf['cf_salesinvoice_beat']=rsocf['cf_xrso_beat'];
 		socf['cf_xsalesorder_billing_address_pick']=soBillAds.xaddressid;
 		socf['cf_xsalesorder_shipping_address_pick']=soShipAds.xaddressid;
 		var nextStage= await self.getStageAction('Submit',log);
 		socf['cf_xsalesorder_next_stage_name'] = nextStage.cf_workflowstage_next_stage;
 		so['status'] = nextStage.cf_workflowstage_next_content_status;
 		so['salesorder_status']='Open Order';
 		socf['cf_xsalesorder_seller_id']=distId;
 		socf['cf_xsalesorder_buyer_id']=buyerId;
 		var {xGenSeries,xtransactionseriesid} = await self.getDefaultXSeries(distId,'Sales Order',true,log);
 		socf['cf_salesorder_transaction_number']=xGenSeries;
 		socf['cf_salesorder_transaction_series']=xtransactionseriesid;
 		socf['created_at']=moment().format('YYYY-MM-DD HH:mm:ss');
 		socf['modified_at']=moment().format('YYYY-MM-DD HH:mm:ss');
 		socf['deleted']=0;
 		var TAX_TYPE=await self.getInvMgtConfig('ALLOW_GST_TRANSACTION');
		
		if(TAX_TYPE.toLowerCase()=='true' || Number(TAX_TYPE)==1){
			so['trntaxtype']='GST';
			var {gstinno,statecode}=await self.getBuyerGSTStateInfo(soShipAds.xaddressid,so['buyerid'],log);
			so['buyer_gstinno']=gstinno;
			so['buyer_state']=statecode;
			var {sellerGstinNo,sellerStateCode}=await self.getSellerGstStateInfo(distId,log);
			so['seller_gstinno']=sellerGstinNo;
			so['seller_state']=sellerStateCode;

		}
		else{
			so['trntaxtype']="VAT";
		}
 		return{so:so,socf:socf,soBillAds:soBillAds,soShipAds:soShipAds};
 	}
 	rSalesOrder.prototype.getSellerGstStateInfo= async function (distId, log){
 		try{
 			var self=this;
 			var dbconn=this.getDb();
 			return await dbconn.query("SELECT xDis.gstinno,xState.statecode from vtiger_xdistributor xDis						INNER JOIN vtiger_xdistributorcf xDiscf on xDiscf.xdistributorid=xDis.xdistributorid						INNER JOIN vtiger_xstate xState on xState.xstateid=xDiscf.cf_xdistributor_state where xDis.xdistributorid=?",{
 				type:QueryTypes.SELECT,
 				replacements:[distId],
 				logging:(msg)=>{
 					log.debug(msg)
 				}
 			}).spread((info)=>{
 				return {sellerGstinNo:info.gstinno,sellerStateCode:info.statecode};
 			})
 		}
 		catch(e){
 			log.error(e.message);
 			return {sellerGstinNo:'',sellerStateCode:''};
 		}
 	}
 	rSalesOrder.prototype.getBuyerGSTStateInfo=async function(xaddressid,buyerid,log){
 		try{
 			
 			var self=this;
 			var dbconn=this.getDb();
 			return await dbconn.query("SELECT xAdd.gstinno,xState.statecode from vtiger_xaddress xAdd INNER JOIN vtiger_xstate xState on xState.xstateid=xAdd.xstateid where xAdd.xaddressid=?", 
 				{ type: QueryTypes.SELECT,replacements:[xaddressid], logging:(msg)=>{log.debug(msg)}}).spread(async (info)=>{
 					if(info){
 						if(typeof(info.gstinno)=='undefined' || info.gstinno==''){

 							return await dbconn.query('SELECT vtiger_xretailer.gstinno,xState.statecode FROM vtiger_xretailer INNER JOIN vtiger_xretailercf on vtiger_xretailercf.xretailerid=vtiger_xretailer.xretailerid LEFT JOIN vtiger_xstate xState on xState.xstateid=vtiger_xretailercf.cf_xretailer_state  where vtiger_xretailercf.xretailerid=?',{
 							type:QueryTypes.SELECT,replacements:[buyerid],logging:(msg)=>{log.debug(msg)}
 							}).spread((info)=>{
 									return {gstinno:info.gstinno,statecode:info.statecode}
 								})
 							
 						}
 						else{
 							
 							return {gstinno:info.gstinno,statecode:info.statecode}
 						}
 					}
 					else{
 						return await dbconn.query("SELECT vtiger_xretailer.gstinno,xState.statecode FROM vtiger_xretailer INNER JOIN vtiger_xretailercf on vtiger_xretailercf.xretailerid=vtiger_xretailer.xretailerid LEFT JOIN vtiger_xstate xState on xState.xstateid=vtiger_xretailercf.cf_xretailer_state  where vtiger_xretailercf.xretailerid=?",{
 					type:QueryTypes.SELECT,replacements:[buyerid],logging:(msg)=>{log.debug(msg)}
 					}).spread((info)=>{
 							
 							return {gstinno:info.gstinno,statecode:info.statecode}
 						})
 					}
 				}).catch(e=>{
 					log.error(e.message);
 					
 					return {gstinno:'',statecode:''}
 				});
 			
 		}
 		catch(e){
 			
 			log.error(e.message);
 			return {gstinno:'',statecode:''}
 		}
 	}
 	rSalesOrder.prototype.getDefaultXSeries=async function(distId,type,increment=true,log){
 		try{
 			var self=this;
 			var dbconn=this.getDb();
 			const XSeries=dbconn.import('./../../models/x-series');
 			const XSeriesCf=dbconn.import('./../../models/x-series-cf');
 			return XSeriesCf.findOne({
 				where:{
 					cf_xtransactionseries_transaction_type:type
 				},
 				order:[
 					['cf_xtransactionseries_mark_as_default','DESC'],
 					['xtransactionseriesid','DESC']
 				],
				include:[{
 					model:XSeries,
 					required:true,
 					where:{xdistributorid:distId,deleted:0},
 					
 				}],
 				logging:(msg)=>{
 					log.debug(msg);
 				}
 			}).then(async function(series){
 				
 				if(series){
 					try{
 						
 						const diffFromLastXDate= await self.getDiffernceBtLastXDate(series);
 						
 						var nextValue=currentValue=minValue=0;
 						if(series.cf_xtransactionseries_cycle_frequency=='Daily'||series.cf_xtransactionseries_cycle_frequency=='Monthly' || series.XSery.fiscal_finance.length<=0){
 							if(diffFromLastXDate>0){
 								nextValue=currentValue=series.cf_xtransactionseries_minimum_value;
 								minValue=1;
 							}
 							else{
 								currentValue =series.cf_xtransactionseries_current_value;
 								nextValue=currentValue= Number(currentValue)+1;
 							}
 						}
 						else{
 							
 							if(diffFromLastXDate>0){
 								const fiscalFinanceMonth=moment().month('"'+series.XSery.fiscal_finance+'"').format('MM');
 								const currentMonth=moment().format('MM');
 								
 								if(fiscalFinanceMonth.isSameOrAfter(currentMonth) || diffFromLastXDate>1 ||series.XSery.fiscal_finance.length<=0){
 									nextValue=currentValue=series.cf_xtransactionseries_minimum_value;
 									minValue = 1;
 								}
 								else{
 									currentValue =series.cf_xtransactionseries_current_value;
 									nextValue=currentValue= Number(currentValue)+1;
 								}
 							}
 							else{
 								const fiscalFinanceYearMonth=moment().month('"'+series.XSery.fiscal_finance+'"').format('YYYY-MM');
 								
 								const currentYearMonth=moment().format('YYYY-MM');
 								
 								const LastDateUpdate=moment(series.cf_xtransactionseries_last_fetch_date).format('YYYY-MM');
 								const fisMonthCurYear=moment([moment().format('YYYY'),moment().month('"'+series.XSery.fiscal_finance+'"').format('MM')]).format('YYYY-MM');
 								
 								if(currentYearMonth>=fisMonthCurYear && LastDateUpdate<fisMonthCurYear){
 									
 									nextValue=currentValue=series['cf_xtransactionseries_current_value'];
 									minValue=1;
 								}
 								else{
 									nextValue=currentValue=Number(series['cf_xtransactionseries_current_value'])+1;
 								}
 							}
 						}
 						if(increment==true){
 							if(minValue==1){
 								
 								series.cf_xtransactionseries_current_value=series.cf_xtransactionseries_minimum_value;
 								series.cf_xtransactionseries_last_fetch_date=moment().format('YYYY-MM-DD HH:mm:ss');
 								series.save().then(()=>{
 									nextValue=currentValue=series.cf_xtransactionseries_current_value;

 								});

 							}
 							else{
 								series.cf_xtransactionseries_current_value=Number(series.cf_xtransactionseries_current_value)+1;
 								series.cf_xtransactionseries_last_fetch_date=moment().format('YYYY-MM-DD HH:mm:ss');
 								series.save().then(()=>{
 									nextValue=currentValue=series.cf_xtransactionseries_current_value;
 								});
 							}
 							
 						}
 						var xGenSeries='';
 						for( let key in series.rawAttributes ){
 							
 							if(key.includes('scheme') && series[key].length>0 ){
 								if(Number(key.substr(-2))){
 									var gen=await self.getNextValueForSeries(series[key],nextValue);
 									xGenSeries=xGenSeries+gen;
 								}
 								else{
 									xGenSeries=xGenSeries+series[key];
 								}

 							}

 						}
 						
 						return {xGenSeries:xGenSeries,xtransactionseriesid:series.xtransactionseriesid};
 						
 					}
 					catch(e){
 						log.error(e.message);
 						return false;
 					}
 				}
 				else{
 					return false;
 				}
 				
 			}).catch(e=>{
 				log.error(e.message);
 				return false;
 			});
 		}catch(e){
 			log.error(e.message)
 			return false;
 		}
 	}

 	rSalesOrder.prototype.getDiffernceBtLastXDate= async function(trans){
 		
 		try{
 			if(trans.cf_xtransactionseries_last_fetch_date.length<=0){
 				return 1;
 			}
 			else{
 				const currentDate=moment();
 				const lastXDate=moment(trans.cf_xtransactionseries_last_fetch_date,'YYYY-MM-DD');
 				switch(trans.cf_xtransactionseries_cycle_frequency){
 					case 'Daily' :
 					return currentDate.diff(lastXDate,'days');
 					break;
 					case 'Monthly' :
 					return currentDate.diff(lastXDate,'months');
 					break;
 					default:
 					
 					return currentDate.diff(lastXDate,'years');
 					break;
 				}
 			}
 			
 		}catch(e){
 			
 			return 1;
 		}
 	}

 	rSalesOrder.prototype.getNextValueForSeries=async function(value,nextValue){
 		
 		
 		switch (value) {
 			case "DD":
 				return moment().format('DD').toString();
 			break;
 			case "MM":
 				return moment().format('MM').toString();
 			break;
 			case "MMM":
 			 return moment().format('MMM').toString();
 			break;
 			case "YY":
 				return moment().format('YY').toString();
 			break;
 			case "YYYY":
 					return moment().format('YYYY').toString();
 			break;
 			case "HH":
 					return moment().format('HH').toString();
 			break;
 			case "mm":
 					return moment().format('mm').toString();
 			break;
 			case "SS":
 					return moment().format('SS').toString();
 			break;
 			default: 
 				return nextValue.toString().padStart((nextValue.toString().length+value.length),"0");
 			
 			break;
 		}
 		
 		
 	}
 	rSalesOrder.prototype.getCreditTerm=async function(buyerId,log){
 		try{
 			var self=this;
 			var dbconn=this.getDb();
 			const Retailer=dbconn.import('./../../models/retailer');
 			const RetailerCf=dbconn.import('./../../models/retailer-cf');
 			return RetailerCf.findOne({
 				where:{
 					xretailerid:buyerId,
 					cf_xretailer_status:'Approved',
 					cf_xretailer_active:'1',},
 					attributes:['cf_xretailer_creditdays','cf_xpayment_payment_mode'],
 				//,
 				include:[
 				{
 					model:Retailer,
 					required:true,
 					attributes:['xretailerid','customercode','customername']

 				}
 				],
 				logging:(msg)=>{
 					log.debug(msg)
 				}
 			}).then(retailer=>{
 				return retailer.cf_xretailer_creditdays;
 			}).catch(e=>{
 				
 			});
 		}catch(e){

 		}
 	}
 	rSalesOrder.prototype.prepareBillAds=async function(soId,refId,log){
 		var self=this;
 		var dbconn=this.getDb();
 		log.info("refId"+refId)
 		const SoBillAds=dbconn.import('./../../models/so-bill-ads');
 		soBillAds=new SoBillAds();
 		var billAddress=await self.getAddress('Billing',refId,log);
 		
 		soBillAds['sobilladdressid']=soId;
 		soBillAds['bill_street']=billAddress.AddressCf.cf_xaddress_address;
 		soBillAds['bill_pobox']=billAddress.AddressCf.cf_xaddress_po_box;
 		soBillAds['bill_city']=billAddress.AddressCf.cf_xaddress_city;
 		soBillAds['bill_state']=await self.getState(billAddress.xstateid,log);
 		soBillAds['bill_code']=billAddress.AddressCf.cf_xaddress_postal_code;
 		soBillAds['bill_country']=billAddress.AddressCf.cf_xaddress_country;
 		soBillAds['xaddressid']=billAddress.xaddressid;
 		return soBillAds;
 	}

 	rSalesOrder.prototype.prepareShipAds=async function(soId,refId,log){
 		var self=this;
 		var dbconn=this.getDb();
 		const SoShipAds=dbconn.import('./../../models/so-ship-ads');
 		soShipAds=new SoShipAds();
 		var shipAddress=await self.getAddress('Shipping',refId,log);
 		soShipAds['soshipaddressid']=soId;
 		soShipAds['ship_street']=shipAddress.AddressCf.cf_xaddress_address;
 		soShipAds['ship_pobox']=shipAddress.AddressCf.cf_xaddress_po_box;
 		soShipAds['ship_city']=shipAddress.AddressCf.cf_xaddress_city;
 		soShipAds['ship_state']=await self.getState(shipAddress.xstateid,log);
 		soShipAds['ship_code']=shipAddress.AddressCf.cf_xaddress_postal_code;
 		soShipAds['ship_country']=shipAddress.AddressCf.cf_xaddress_country;
 		soShipAds['gstinno']=shipAddress.gstinno;
 		soShipAds['xaddressid']=shipAddress.xaddressid;

 		return soShipAds;
 	}

 	rSalesOrder.prototype.getCustomerRefId=async function(buyerId,log){
 		var self=this;
 		const dbconn=this.getDb();
 		const RecCustMaster=dbconn.import('./../../models/rec-cust-mas');
 		return RecCustMaster.findOne({
 			where:{xreceivecustomermasterid:buyerId},
 			attributes:['reference_id'],
 			logging:(msg)=>{
 				log.debug(msg);
 			}
 		}).then(cust=>{
 			if(cust){
 				return cust.reference_id;
 			}
 			else{
 				return buyerId;
 			}
 		}).catch(e=>{
 			return buyerId;
 		})
 	}
 	rSalesOrder.prototype.getStageAction=async function(action,log){
 		try{
 			const dbconn=this.getDb();
 			var self=this;
 			const WFStageCf=dbconn.import('./../../models/workflow-stage-cf');
 			const WorkFlowCf=dbconn.import('./../../models/workflow-cf');
 			return WorkFlowCf.findOne({
 				where:{
 					cf_workflow_module:'xrsalesorder',
 					
 				},
 				include:[{model:WFStageCf,required:true,where:{cf_workflowstage_user_role:'Distributor',
 				cf_workflowstage_possible_action:action}}],
 				logging:(msg)=>{
 					log.debug(msg);
 				}
 				
 			}).then(res=>{
 				if(res.dataValues.WFStageCfs[0].dataValues){
 					return res.dataValues.WFStageCfs[0].dataValues;
 				}
 			}).catch(e=>{
 				return false;
 			});
 		}catch(e){
 			return false
 		}

 	}
 	rSalesOrder.prototype.isSoConverted=async function(soid,log){
 		try{
 			const dbconn=this.getDb();
 			var self=this;
 			const CrmEntityRel=dbconn.import('./../../models/crmentity-rel');
 			return CrmEntityRel.findOne({
 				where:{
 					relmodule:'xSalesOrder',module:'xrSalesOrder',crmid:soid
 				},
 				logging:(msg)=>{
 					log.debug(msg)
 				}
 			}).then(res=>{
 				if(res){
 					return true;
 				}
 			}).catch(e=>{
 				return false;
 			});
 		}
 		catch(e){
 			return false;
 		}
 	}
 	rSalesOrder.prototype.getCrmEntityRel=async function(refId,log){
 		try{
 			var self=this;
 			var dbconn=this.getDb();
 			const CrmEntityRel=dbconn.import('./../../models/crmentity-rel');
 			return CrmEntityRel.findAll({
 				where:{crmid:refId,relmodule:'xAddress'},
 				attributes:['relcrmid'],
 				logging:(msg)=>{
 					log.debug(msg)
 				}
 			}).then(entity=>{
 				if(entity){
 					var relCrmIds=entity.map(entity=>entity.relcrmid)
 					return relCrmIds;
 				}
 			}).catch(e=>{
 				return false;
 			})
 		}catch(e){
 			return false;
 		}
 	}
 	rSalesOrder.prototype.getState=async function(stateId,log){
 		try{
 			var self=this;
 			var dbconn=this.getDb();
 			const State=dbconn.import('./../../models/state');
 			return State.findOne({
 				where:{xstateid:stateId},
 				attributes:['statename'],
 				logging:(msg)=>{
 					log.debug(msg);
 				}
 			}).then(state=>{
 				if(state){
 					return state.statename;
 				}
 			}).catch(e=>{
 				return false;
 			})
 		}catch(e){
 			return false;
 		}
 	}
 	rSalesOrder.prototype.getAddress=async function(type,refId,log){
 		try{

 			var self=this;
 			var dbconn=this.getDb();
 			const AddressCf=dbconn.import('./../../models/address-cf');
 			const Address=dbconn.import('./../../models/address');
 			
 			const State=dbconn.import('./../../models/state');
 			var relCrmId=await self.getCrmEntityRel(refId,log);
 			return Address.findOne({
 				attributes:['addresscode','gstinno','xstateid','xaddressid'],
 				include:[
 				{
 					model:AddressCf,
 					required:true,
 					where:{
 						cf_xaddress_address_type:type,
 						cf_xaddress_mark_as_default:1,
 						cf_xaddress_active:1,
 						xaddressid:{[Op.in]:relCrmId},
 					}
 				}
 				],
 				logging:(msg)=>{
 					log.debug(msg)
 				}
 			}).then(res=>{
 				if(res){
 					return res;
 				}
 			}).catch(e=>{
 				return false;
 			});		
 		}catch(e){
 			return false;
 		}
 	}
 	rSalesOrder.prototype.getEnityForRelativeModules=async function(moduleName,mand,prkey,log,column){
 		try{
 			const dbconn=this.getDb();
 			const VtigerField=dbconn.import('./../../models/vtiger-field');
 			const VtigerTab=dbconn.import('./../../models/vtiger-tab');
 			const EnityName=dbconn.import('./../../models/entity-name');
 			return await EnityName.findOne({
 				where:{modulename:moduleName},
 				attributes:['tabid','tablename','entityidfield'],
 				logging:(msg)=>{
 						log.debug(msg)
					}
 				}).then(async(entity)=>{
 					if(entity){
 						if(mand=='MU'){
 							var filedQuery="SELECT fieldid,columnname,uitype,vtiger_tab.`name` FROM vtiger_field INNER JOIN vtiger_tab on vtiger_tab.tabid=vtiger_field.tabid AND vtiger_field.xmlreceivetable = '1' WHERE tablename in ('"+entity.tablename+"','"+entity.tablename+"cf') AND columnname = '"+column+"'";
 						}
 						else{
 							var filedQuery="SELECT fieldid,columnname,uitype,vtiger_tab.`name` FROM vtiger_field INNER JOIN vtiger_tab on vtiger_tab.tabid=vtiger_field.tabid AND vtiger_field.xmlreceivetable = '1' WHERE tablename in ('"+entity.tablename+"','"+entity.tablename+"cf') AND FIND_IN_SET  (columnname,'"+prkey+"')";
 						}
 						return await dbconn.query(filedQuery,{
 							type:QueryTypes.SELECT,
 							logging:(msg)=>{
 								log.debug(msg);
 							}
 						}).spread(async(field)=>{
 							return {columnname:field.columnname,entityidfield:entity.entityidfield}
 						}).catch(e=>{
 							log.error("Getting issue while getting values from getEnityForRelativeModules "+e.message)
 						})
 					}
 					else{

 						log.error(" No entity information found for module:"+moduleName);

 					}
 				}).catch(e=>{
 					log.error(e.message);
 				});
 			log.info("Module table Names: "+rSalesOrder.tableName+","+rSalesOrder.tableName+'cf');
 			return VtigerField.findAll({
 				where:{
 					tablename:[rSalesOrder.tableName,rSalesOrder.tableName+'cf'],xmlreceivetable:1},
 					attributes: ['fieldid','columnname','typeofdata','uitype','tabid'],
 					include:[{model:VtigerTab,required:true,attributes:['tabid','name']}],
 					logging:(msg)=>{
 						log.debug(msg);
 					}
 				}).then(fields => {
 					return fields;
 				}).catch(e=>{
 					return e.error;
 				});
 			
 		}
 		catch(e){
 			log.error(e.message);
 		}

 	}
 	rSalesOrder.prototype.getCrmEntity=async function(module,log){
 		const dbconn=this.getDb();
 		const CrmEntity=dbconn.import('./../../models/crmentity');
 		const CrmEntitySeq=dbconn.import('./../../models/crmentityseq');
 		const VtigerTab=dbconn.import('./../../models/vtiger-tab');
 		var id=await CrmEntitySeq.fnxtIncrement(log);
 		var tab=await VtigerTab.getTab(module,log);
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
 			sendstatus:0,
 			terms_conditions:null,
 		});
 		return rsocrm.save({logging:(msg)=>{
 			log.debug(msg);
 		}}).then(crm=>{
 			return crm.crmid;
 		}).catch(e=>{
 			
 			log.error(e.message);
 			throw new Error('Unable to create CRM entity for rSalesOrder.');
 		});

 	}
 	return rSalesOrder;
 })();
 module.exports=exports=rSalesOrder;
