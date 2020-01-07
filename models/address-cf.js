var Address=require('./address');
var CrmEntityRel=require('./crmentity-rel');
module.exports=(sequelize,DataTypes)=>{
    const AddressCf=sequelize.define('AddressCf',{
        xaddressid:{
            type:DataTypes.INTEGER(11),
            primaryKey: true,
        },
        cf_xaddress_address_type:{
            type:DataTypes.STRING(100),
            defaultValue:'',
            
        },
        cf_xaddress_address:{
            type:DataTypes.TEXT,
            
        },
        cf_xaddress_po_box:{
            type:DataTypes.STRING(100),
            defaultValue:'',
        },
        cf_xaddress_city:{
            type:DataTypes.STRING(100),
            defaultValue:'',
        },
        cf_xaddress_postal_code:{
            type:DataTypes.STRING(100),
            defaultValue:'',
        },
        cf_xaddress_active:{
            type:DataTypes.INTEGER(2),
            defaultValue:0,
        },
        cf_xaddress_country:{
            type:DataTypes.STRING(100),
            defaultValue:'',
        },
        cf_xaddress_distributor:{
            type:DataTypes.STRING(100),
            defaultValue:'',
        },
        cf_xaddress_mark_as_default:{
            type:DataTypes.STRING(3),
            defaultValue:'0',
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
        tableName:'vtiger_xaddresscf',
        timestamps:false,
        freezeTableName:true,
        indexes: [ { fields: [ 
            'xaddressid',
            'cf_xaddress_mark_as_default',
            'cf_xaddress_active',
            'cf_xaddress_address_type' ] }],

    });
    /*AddressCf.belongsTo(sequelize.models.CrmEntityRel,{
            foreignKey:'relcrmid',
            targetKey:'xaddressid',
            constraints: false,
    });*/
   /* AddressCf.belongsTo(sequelize.models.Address,{
            foreignKey:'xaddressid',
            sourceKey:'xaddressid',
    });*/
    return AddressCf;
};