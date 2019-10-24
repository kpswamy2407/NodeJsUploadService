module.exports=(sequelize,DataTypes)=>{
    const Uom=sequelize.define('Uom',{
        uomid:{
            type:DataTypes.INTEGER(11),
            primaryKey: true,
            defaultValue:0,
        },
        uomname:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        uqc:{
            type:DataTypes.STRING(255),
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
        tableName:'vtiger_uom',
        timestamps:false,
        freezeTableName:true,
    });
    return Uom;
};