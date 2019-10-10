var VtigerTab=require('./vtiger-tab');
module.exports=(sequelize,DataTypes)=>{
    const VtigerField=sequelize.define('VtigerField',{
        fieldid:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tabid:{
            type:DataTypes.INTEGER(19),
            
        },
        columnname:{
            type:DataTypes.STRING(100),
            
        },
        tablename:{
            type:DataTypes.STRING(100),
        },
        generatedtype:{
            type:DataTypes.INTEGER(19),
            defaultValue:0,
        },
        uitype:{
            type:DataTypes.INTEGER(11),
            defaultValue:null,
        },
        fieldname:{
            type:DataTypes.STRING(50),
            
        },
        fieldlabel:{
            type:DataTypes.STRING(50),
            defaultValue:null,
        },
        readonly:{
            type:DataTypes.INTEGER(1),
            
        },
        presence:{
             type:DataTypes.INTEGER(19),
            defaultValue:1,
        },
        selected:{
             type:DataTypes.INTEGER(1),
            
        },
        maximumlength:{
             type:DataTypes.INTEGER(19),
            defaultValue:null,
        },
        sequence:{
             type:DataTypes.INTEGER(19),
            defaultValue:null,
        },
        block:{
             type:DataTypes.INTEGER(19),
            defaultValue:null,
        },
        displaytype:{
             type:DataTypes.INTEGER(19),
            defaultValue:null,
        },
        typeofdata:{
             type:DataTypes.STRING(100),
            defaultValue:null,
        },
        quickcreate:{
             type:DataTypes.INTEGER(19),
            defaultValue:1,
        },
        quickcreatesequence:{
             type:DataTypes.INTEGER(19),
            defaultValue:null,
        },
        info_type:{
             type:DataTypes.STRING(20),
            defaultValue:null,
        },
        masseditable:{
             type:DataTypes.INTEGER(10),
            defaultValue:1,
        },
        xmlsendtable:{
             type:DataTypes.INTEGER(10),
            
        },
        xmlreceivetable:{
             type:DataTypes.INTEGER(10),
            
        },
        help:{
             type:DataTypes.TEXT,
            
        },
    },
    {
        tableName:'vtiger_field',
        timestamps:false,
        freezeTableName:true,
    });
    VtigerField.belongsTo(sequelize.models.VtigerTab,{
            foreignKey:'tabid',
            sourceKey:'tabid',
        });
    return VtigerField;
};