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
    CrmEntitySeq.fnxtIncrement= function(log){
        return sequelize.query('UPDATE vtiger_crmentity_seq SET id=LAST_INSERT_ID(id + 1)',{
            types: sequelize.QueryTypes.UPDATE,
            logging:(msg)=>{
                log.debug(msg)
            }
        }).spread( result => {
            return result.insertId;
        }).catch(e=>{
            return false;
        });
    
    }
    return CrmEntitySeq;
};