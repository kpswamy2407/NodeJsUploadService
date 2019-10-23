module.exports=(sequelize,DataTypes)=>{
    const XGridField=sequelize.define('XGridField',{
        trg_id:{
            type:DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrment:true,
        },
        fieldid:{
            type:DataTypes.INTEGER(11),
        },
        columnname:{
            type:DataTypes.STRING(255),
            
        },
        tablename:{
            type:DataTypes.STRING(100),
            
        },
        uitype:{
            type:DataTypes.STRING(100),
            
        },
         xmlsendtable:{
            type:DataTypes.INTEGER(11),
           
        },
         xmlreceivetable:{
            type:DataTypes.INTEGER(11),
        },
       
    },{
        tableName:'sify_tr_grid_field',
        timestamps:false,
        freezeTableName:true,
    });
    return XGridField;
};