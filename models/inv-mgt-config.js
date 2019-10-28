module.exports=(sequelize,DataTypes)=>{
    const InvMgtConfig=sequelize.define('InvMgtConfig',{
        id:{
            type:DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        key:{
            type:DataTypes.STRING(255),
        },
        value:{
            type:DataTypes.TEXT,
        },
        from_stock_type:{
            type:DataTypes.STRING(255),
            defaultValue:null,
        },
        to_stock_type:{
            type:DataTypes.STRING(255),
            defaultValue:null,
        },
        transfer_mode:{
            type:DataTypes.STRING(255),
            defaultValue:null,
        },
        rule_from_stock_type:{
            type:DataTypes.STRING(255),
            defaultValue:null,
        },
        rule_to_stock_type:{
            type:DataTypes.STRING(255),
            defaultValue:null,
        },
        claim_amt:{
            type:DataTypes.STRING(255),
            defaultValue:null,
        },
        treatment:{
             type:DataTypes.STRING(255),
            defaultValue:null,
        },
        type:{
             type:DataTypes.STRING(255),
            defaultValue:'text',
        },
        help:{
             type:DataTypes.STRING(255),
            defaultValue:null,
        },
        dist_id:{
            type:DataTypes.INTEGER,
            
        },
        created_dtm:{
            type:DataTypes.DATE,
        },
    },{
        tableName:'sify_inv_mgt_config',
        timestamps:false,
        freezeTableName:true,
    });
    return InvMgtConfig;
};