var Address=require('./address');
module.exports=(sequelize,DataTypes)=>{
    const State=sequelize.define('State',{
        xstateid:{
            type:DataTypes.INTEGER(11),
            defaultValue:null,
        },
        statename:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        statecode:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        stateshortcode:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        is_allstate:{
            type:DataTypes.INTEGER(4),
            defaultValue:null,
        },
        zone_prefix:{
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
        
    },
    {
        tableName:'vtiger_xstate',
        timestamps:false,
        freezeTableName:true,
        indexes: [ { fields: [ 
            'xstateid'] }],

    });
    /*State.hasMany(sequelize.models.Address,{
        foreignKey:'xstateid',
        sourceKey:'xstateid',
    });*/
    return State;
};