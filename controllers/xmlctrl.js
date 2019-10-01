const { Base }=require('./../core');
const { __extends }=require('tslib');

/**
 * 
 * @see 
 * @since Tue October 01, 2019 05:24 PM.
 * @author nandha.viswanathan@sifycorp.com 
 */
var XmlCtrl=(function(){
    function XmlCtrl(){
        Base.call(this);
    }
    __extends(XmlCtrl,Base);
    XmlCtrl.prototype.saveXml=function(){
        return new Promise((rs,rj) => {
            this.debug('nandha');
            this.info('kumar');
            this.trace('kumar');
            rs(true);
        });
    }
    return XmlCtrl;
})();
module.exports=exports=XmlCtrl;
