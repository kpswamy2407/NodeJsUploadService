module.exports=(sequelize,DataTypes)=>{
    const XTaxRel=sequelize.define('XTaxRel',{
        id:{
            type:DataTypes.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        transaction_id:{
            type:DataTypes.BIGINT(20),
        },
        transaction_line_id:{
            type:DataTypes.BIGINT(20),
            defaultValue:0,
        },
        lineitem_id:{
            type:DataTypes.BIGINT(20),
            
        },
        transaction_name:{
            type:DataTypes.STRING(255),   
        },
        tax_type:{
            type:DataTypes.STRING(255),
        },
        tax_label:{
            type:DataTypes.STRING(255),
        },
        tax_percentage:{
            type:DataTypes.DECIMAL(20,6),
        },

        tax_amt:{
            type:DataTypes.DECIMAL(20,6),
        },

        taxable_amt:{
            type:DataTypes.DECIMAL(20,6),
        },
        xtaxid:{
            type:DataTypes.INTEGER(11),
            defaultValue:null,
        },
        tax_group_type:{
             type:DataTypes.ENUM('CGST','SGST','IGST','VAT'),
        },
        CGST_Amount:{
            type:DataTypes.DECIMAL(20,6),
        },
        SGST_Amount:{
            type:DataTypes.DECIMAL(20,6),
        },
        IGST_Amount:{
            type:DataTypes.DECIMAL(20,6),
        },
        CGST_Rate:{
            type:DataTypes.DECIMAL(20,6),
        },
        SGST_Rate:{
            type:DataTypes.DECIMAL(20,6),
        },
        IGST_Rate:{
            type:DataTypes.DECIMAL(20,6),
        },
        created_dtm:{
            type:DataTypes.DATE,
            defaultValue:date.Now(),
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
        tax_on_uom_flag:{
             type:DataTypes.INTEGER(3),
             defaultValue:null,  
        },
        tax_display_percentage:{
            type:DataTypes.DECIMAL(20,6),
            defaultValue:null,
        },
    },{
        tableName:'sify_xtransaction_tax_rel',
        timestamps:false,
        freezeTableName:true,
        indexes: [ 
        { fields: [ 'transaction_id' ] },
        { fields:['transaction_line_id']},
        { fields:['tax_type','transaction_id']},
        { fields:['tax_type']},
        {fields:['transaction_id','transaction_line_id','transaction_name']},
        ],
    });
    return XTaxRel;
};