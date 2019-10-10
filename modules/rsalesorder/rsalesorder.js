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
        return this;
    };
    rSalesOrder.prototype.import=function(xml){
        this.importAssoc();
        var crdr=new CollecReader(this._xmljs);
        var rSalesOrder=this.models['rSalesOrder'];
        var VtigerField=this.models['VtigerField'];
        var VtigerTab=this.models['VtigerTab'];
        var rso=new rSalesOrder();
        VtigerField.findAll({
                where:{
                    tablename:[rSalesOrder.tableName,rSalesOrder.tableName+'cf'],xmlreceivetable:1},
                attributes: ['fieldid','columnname','typeofdata','uitype','tabid'],
                include:[{model:VtigerTab,required:true,attributes:['tabid','name']}],
                }).then(fields => {
            fields.forEach(field=>{
                console.log(field.VtigerTab.name);
            })
        }).catch(err=>{console.log(err)});
        return Promise.resolve(true);
        //

        
        //rso.lbl_rso_save_pro_cate=false;
        rso.subject=crdr.subject();
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
    return rSalesOrder;
})();
module.exports=exports=rSalesOrder;
