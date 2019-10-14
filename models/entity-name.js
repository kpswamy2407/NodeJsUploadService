module.exports=(sequelize,DataTypes)=>{
    const EntityName=sequelize.define('EntityName',{
        tabid:{
            type:DataTypes.INTEGER(19),
            primaryKey: true,
            defaultValue:0,
        },
        modulename:{
            type:DataTypes.STRING(255),
        },
        tablename:{
            type:DataTypes.STRING(255),
        },
        fieldname:{
            type:DataTypes.STRING(255),
            
        },
        entityidfield:{
            type:DataTypes.STRING(255),   
        },
        entityidcolumn:{
            type:DataTypes.STRING(255),
        },
    },{
        tableName:'vtiger_entityname',
        timestamps:false,
        freezeTableName:true,
        indexes: [ {fields: [ 'modulename' ] } ],
    });
    return EntityName;
};