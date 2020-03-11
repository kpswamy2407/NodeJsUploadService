module.exports=(sequelize,DataTypes)=>{
    const RsoBillAds=sequelize.define('RsoBillAds',{
        sobilladdressid:{
            type:DataTypes.INTEGER(19),
            primaryKey: true,
            defaultValue:0,
        },
        bill_city:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        bill_code:{
            type:DataTypes.STRING(255),
            defaultValue:null,
        },
        bill_country:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },

        bill_state:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        bill_street:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        bill_pobox:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        created_at:{
            type:DataTypes.DATE,
            defaultValue:null,
        },
        modified_at:{
            type:DataTypes.DATE,
            defaultValue:null,
        },
        deleted:{
            type:DataTypes.INTEGER(1),
            defaultValue:0,
        },
        
    },{
        tableName:'vtiger_rsobillads',
        timestamps:false,
        freezeTableName:true,
       });
    return RsoBillAds;
};