module.exports=(sequelize,DataTypes)=>{
    const Beat=sequelize.define('Beat',{
        xbeatid:{
            type:DataTypes.INTEGER(11),
            primaryKey: true,
            defaultValue:0,
        },
        beatname:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        beatcode:{
            type:DataTypes.STRING(255),
            defaultValue:null,
        },
        cf_xbeat_distirbutor_id:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },

        classification:{
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
        counter_sales_beat:{
            type:DataTypes.INTEGER(3),
            defaultValue:0, 
        },
    },{
        tableName:'vtiger_xbeat',
        timestamps:false,
        freezeTableName:true,
        indexes: [ { fields: [ 'beatcode' ] },{fields:['cf_xbeat_distirbutor_id']},{fields:['cf_xbeat_distirbutor_id']} ],
    });
    return Beat;
};