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
        return this;
    };
    rSalesOrder.prototype.import=function(xml){
        this.importAssoc();
        var crdr=new CollecReader(this._xmljs);
        var rSalesOrder=this.models['rSalesOrder'];
        var rso=new rSalesOrder();
        VtigerField.findAll({
            where:{
                table_name: rSalesOrder.tableName(),receive_x
            }
        }).then(felds => {
            firlds.forEach(field => {
                rso[field.name]=crdr.get(field.name);
            });
            return rso;
        }). then()
        rso.subject=crdr.subject();
        rso.save();
       
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
