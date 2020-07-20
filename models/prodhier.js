module.exports=(sequelize,DataTypes)=>{
    const Prodhier=sequelize.define('Prodhier',{
        xprodhierid:{
            type:DataTypes.INTEGER(19),
            defaultValue:0,
            primaryKey: true,
        },
        prodhiername:{
            type:DataTypes.STRING(255),
            defaultValue:null,

        },
        prodhiercode:{
            type:DataTypes.STRING(255),
            defaultValue:null,
        },
        image_name:{
            type:DataTypes.STRING(255),
            defaultValue:null,
            
        },
        erp_code:{
            type:DataTypes.TEXT,
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
         penalty_discount_nonsaleable:{
            type: DataTypes.DECIMAL(25,3),
            defaultValue:0,
        },
         penalty_discount:{
            type: DataTypes.DECIMAL(25,3),
            defaultValue:0,
        },
         product_type:{
            type:DataTypes.ENUM('Food','Non Food','Others','HFD','OTC-OH'),
            defaultValue:null,
        },
    },{
        tableName:'vtiger_xprodhier',
        timestamps:false,
        freezeTableName:true,
        indexes: [ {fields: [ 'prodhiercode' ] } ],
    });
    return Prodhier;
};