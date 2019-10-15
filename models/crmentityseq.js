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
    CrmEntitySeq.fnxtIncrement=function(){
        return CrmEntitySeq.findOne()
            .then(function(seq){
                return seq.increment('id');
            })
            .then(function(){
                return CrmEntitySeq.findOne()
            })
            .then(function(seq){
                return seq.id;
            })
            .catch(function(err){
                throw new Error('Error while incrementing the sequence.');
            });
        
    }
    return CrmEntitySeq;
};