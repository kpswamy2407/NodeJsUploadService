const { __extends }=require('tslib');
const { Base, BaseError }=require('./../core');
const fs=require('fs');
var moment = require('moment');

/**
 * 
 * @see 
 * @author kpswamy540@gmail.com.
 * @since Fri October 25, 2019 03:29 PM.
 */
var Audit=(function(){
	__extends(Audit,Base);
	function Audit(){
		Base.call(this);
	};
	Audit.prototype.docName=null;
	Audit.prototype.options=null;
	Audit.prototype.status=null;
	Audit.prototype.reason=null;
	Audit.prototype.recordId='';
	Audit.prototype.distCode=null;
	Audit.prototype.source=null;
	Audit.prototype.destination=null;
	Audit.prototype.createdDate=moment().format('YYYY-MM-DD HH:mm:ss');
	Audit.prototype.rawURL='';
	Audit.prototype.docType=null;
	Audit.prototype.subject=null;
	Audit.prototype.statusCode=null;
	Audit.prototype.statusMsg=null;
	Audit.prototype.docCreatedDate=null;

	
	Audit.prototype.saveLog=function(db){
		try{
			var SendRecAudit=db.import('./../models/send-rec-audit');
			var RecAuditLog=db.import('./../models/rec-audit-log');
			var sendRecAudit=new SendRecAudit();
			sendRecAudit.sen_rec_doc_name=this.docName;
			sendRecAudit.sen_rec_options=this.options;
			sendRecAudit.sen_rec_status=this.status;
			sendRecAudit.sen_rec_reason=this.reason;
			sendRecAudit.sen_rec_recordid=this.recordId;
			sendRecAudit.sen_rec_createddate=this.createdDate;
			sendRecAudit.sen_rec_distcode=this.distCode;
			sendRecAudit.sen_rec_doc_createddate=this.docCreatedDate;
			sendRecAudit.sen_rec_documenttype=this.docType;
			sendRecAudit.sen_rec_rawurl=this.rawURL;
			sendRecAudit.sen_rec_destapplication=this.destination;
			sendRecAudit.sen_rec_sourceapplication=this.source;
			sendRecAudit.save().then(sr=>{
			}).catch(e=>{
				console.log(e);
			});

			var recAuditLog=new RecAuditLog();
			recAuditLog.rec_log_doc_name=this.docName;
			recAuditLog.rec_log_options=this.options;
			recAuditLog.rec_log_status=this.status;
			recAuditLog.rec_log_reason=this.reason;
			recAuditLog.rec_log_recordid=this.recordId;
			recAuditLog.rec_log_createddate=this.createdDate;
			recAuditLog.rec_log_distcode=this.distCode;
			recAuditLog.rec_log_doc_createddate=this.docCreatedDate;
			recAuditLog.rec_log_documenttype=this.docType;
			recAuditLog.rec_log_rawurl=this.rawURL;
			recAuditLog.rec_log_destapplication=this.destination;
			recAuditLog.rec_log_sourceapplication=this.source;
			recAuditLog.rec_log_subject=this.subject;
			recAuditLog.rec_log_status_code=this.statusCode;
			recAuditLog.rec_log_status_msg=this.statusMsg;
			recAuditLog.save().then(rc=>{
				
			}).catch(e=>{
				console.log(e);
			});
		}
		catch(e){
			console.log(e);
		}
		
	};
	
	return Audit;
})();
module.exports=exports=Audit;
