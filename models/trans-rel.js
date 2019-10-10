module.exports=(sequelize,DataTypes)=>{
    const TransRel=sequelize.define('TransRel',{
        trr_id:{
            type:DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        transaction_name:{
            type:DataTypes.STRING(255),
        },
        transaction_rel_table:{
            type:DataTypes.STRING(255),
        },
        billaddtable:{
            type:DataTypes.STRING(255),
            
        },
        shipaddtable:{
            type:DataTypes.STRING(255),   
        },
        profirldname:{
            type:DataTypes.STRING(255),
        },
        relid:{
            type:DataTypes.STRING(255),
        },
        uom:{
            type:DataTypes.STRING(255),
        },
        table_type:{
            type:DataTypes.STRING(255),
        },
        distfieldname_tblname:{
             type:DataTypes.STRING(255),
        },
        categoryid:{
             type:DataTypes.STRING(255),
        },
        receive_pro_by_cate:{
             type:DataTypes.STRING(255),  
        },
    },{
        tableName:'sify_tr_rel',
        timestamps:false,
        freezeTableName:true,
    });
    return TransRel;
};