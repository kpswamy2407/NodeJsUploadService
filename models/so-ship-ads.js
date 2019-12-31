module.exports=(sequelize,DataTypes)=>{
    const SoShipAds=sequelize.define('SoShipAds',{
        soshipaddressid:{
            type:DataTypes.INTEGER(19),
            primaryKey: true,
            defaultValue:0,
        },
        ship_city:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        ship_code:{
            type:DataTypes.STRING(255),
            defaultValue:null,
        },
        ship_country:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },

        ship_state:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        ship_street:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        ship_pobox:{
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
        tableName:'vtiger_soshipads',
        timestamps:false,
        freezeTableName:true,
       });
    return SoShipAds;
};