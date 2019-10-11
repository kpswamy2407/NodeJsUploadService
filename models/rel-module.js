module.exports=(sequelize,DataTypes)=>{
    const RelModule=sequelize.define('RelModule',{
        fieldid:{
            type:DataTypes.INTEGER(11),
        },
        module:{
            type:DataTypes.STRING(100),
        },
        relmodule:{
            type:DataTypes.STRING(100),
        },
        status:{
            type:DataTypes.STRING(10),
            defaultValue:null,
        },
        sequence:{
            type:DataTypes.INTEGER(10),
            defaultValue:null,
        },
        reltablename:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
    },{
        tableName:'vtiger_fieldmodulerel',
        timestamps:false,
        freezeTableName:true,
         indexes: [ { fields: [ 'fieldid' ] } ],
    });
    return RelModule;
};