module.exports=(sequelize,DataTypes)=>{
    const CrmEntitySeq=sequelize.define('CrmEntitySeq',{
        id:{
            type:'INT(11)',
            primaryKey:true,
        }, 
    },
    {
        tableName:'vtiger_crmentity_seq',
        timestamps:false,
        freezeTableName:true,
    });
    CrmEntitySeq.fnxtIncrement= function(){
        return CrmEntitySeq.findOne().then(seq=>{
            return seq.increment('id');
        }).then(seq=>{
            return CrmEntitySeq.findOne();
        }).then(se=>{
            return se.id;
        });
        
    /*
        try{
            return sequelize.transaction(function (t) {
              return CrmEntitySeq.findOne({transaction: t}).then(function (seq) {
                return seq.increment('id',{
                  t
                });
              });
            }).then(function () {
                return CrmEntitySeq.findOne().then(res=>{
                    return res.id;
                })
            }).catch(function (err) {
                console.log(err);

              // Transaction has been rolled back
              // err is whatever rejected the promise chain returned to the transaction callback
            });

        }catch(e){
            console.log(e);
        }
    */}
    /*CrmEntitySeq.updateIncrement= async function(id){
        var newId=id+1;
        CrmEntitySeq.update(
                {modified_at: moment().format('YYYY-MM-DD HH:mm:ss'),deleted:1},
                {where: {crmid:soId}}
            ).then().catch();
        
    }*/
    return CrmEntitySeq;
};