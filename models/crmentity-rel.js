var Address=require('./address');
module.exports=(sequelize,DataTypes)=>{
    const CrmEntityRel=sequelize.define('CrmEntityRel',{
        crmid:{
            type:DataTypes.INTEGER(11),
        },
        module:{
            type:DataTypes.STRING(100),
        },
        relcrmid:{
            type:DataTypes.INTEGER(11),
        },
        relmodule:{
            type:DataTypes.STRING(100),
        },

    },{
        tableName:'vtiger_crmentityrel',
        timestamps:false,
        freezeTableName:true,
        indexes: [ { fields: [ 'crmid' ] },{fields:['relcrmid']},
        {fields:['relmodule']},{fields:['crmid','relcrmid','relmodule','module']} ],
    });
    CrmEntityRel.hasOne(sequelize.models.Address,{
            foreignKey:'xaddressid',
            targetKey:'relcrmid',
    });
    return CrmEntityRel;
};