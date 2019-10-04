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
    rSalesOrder.prototype.import=function(){
        var crdr=new CollecReader(this._xmljs);
        // crdr.lineItems();
        const dbconn=this.getDb();
        const CrmEntity=dbconn.import('./../../models/crmentity');
        CrmEntity.findOne().then(entity => {
            console.log(entity.dataValues);
        });
    };
    return rSalesOrder;
})();
module.exports=exports=rSalesOrder;
