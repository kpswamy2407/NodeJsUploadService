var AddressCf=require('./address-cf');
var State=require('./state');
var CrmEntityRel=require('./crmentity-rel');
module.exports=(sequelize,DataTypes)=>{
    const Address=sequelize.define('Address',{
        xaddressid:{
            type:DataTypes.INTEGER(11),
            primaryKey: true,
        },
        addresscode:{
            type:DataTypes.STRING(100),
            defaultValue:'CODE',
            
        },
        gstinno:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        panno:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        typeofservices:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        xstateid:{
            type:DataTypes.INTEGER(11),
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
        
    },
    {
        tableName:'vtiger_xaddress',
        timestamps:false,
        freezeTableName:true,

    });
    
    Address.hasOne(sequelize.models.AddressCf,{
        foreignKey:'xaddressid',
        sourceKey:'xaddressid',
    });
    /*Address.belongsTo(sequelize.models.State,{
        foreignKey:'xstateid',
        targetKey:'xstateid',
    });*/
    /*Address.belongsTo(sequelize.models.CrmEntityRel,{
        foreignKey:'relcrmid',
        targetKey:'xaddressid',
    });*/

    return Address;
};