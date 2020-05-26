module.exports=(sequelize,DataTypes)=>{
    const XTaxRelSo=sequelize.define('XTaxRelSo',{
		id: {
			type: DataTypes.BIGINT(20),
			autoIncrement:true,
			primaryKey:true,
		},
		transaction_id: {
			type: DataTypes.BIGINT(20),
			
		},
		transaction_line_id: {
			type: DataTypes.BIGINT(20),
			
		},
		lineitem_id: {
			type: DataTypes.BIGINT(20),
			
		},
		tax_type: {
			type: DataTypes.STRING(255),
			
		},
		tax_label: {
			type: DataTypes.STRING(255),
		},
		transaction_type: {
			type: DataTypes.STRING(250),
		},
		tax_percentage: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		tax_amt: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		taxable_amt: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		created_dtm: {
			type: DataTypes.DATE,
			
		},
		tax_group_type: {
			type: DataTypes.ENUM('CGST','SGST','IGST','VAT'),
			defaultValue: null,
		},
		xtaxid: {
			type: DataTypes.INTEGER(11),
			defaultValue: null,
		},
		tax_on_uom_flag: {
			type: DataTypes.INTEGER(3),
			defaultValue: null,
		},
		tax_display_percentage: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		
		created_at: {
			type: DataTypes.DATE,
			defaultValue: null,
		},
		modified_at: {
			type: DataTypes.DATE,
			defaultValue: null,
		},
		deleted: {
			type: DataTypes.INTEGER(1),
			defaultValue: 0,
		},
    },{
        tableName:'sify_xtransaction_tax_rel_so',
        timestamps:false,
        freezeTableName:true,
        indexes: [ 
        {fields: [ 'transaction_id' ] },
        {fields:['transaction_line_id']}
        ]
    });
    
    return XTaxRelSo;
};