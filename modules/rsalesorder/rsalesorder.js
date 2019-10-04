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
<<<<<<< HEAD
    rSalesOrder.prototype.import=function(xml){
        
        this.saveXml(xml);
=======
    rSalesOrder.prototype.import=function(){
        var crdr=new CollecReader(this._xmljs);
        // crdr.lineItems();
>>>>>>> 897266d72e6bb90b21da91deb100f848d6a36379
        const dbconn=this.getDb();
        const CrmEntity=dbconn.import('./../../models/crmentity');
        CrmEntity.findOne().then(entity => {
            console.log(entity.dataValues);
        });
    };
    return rSalesOrder;
})();
module.exports=exports=rSalesOrder;
