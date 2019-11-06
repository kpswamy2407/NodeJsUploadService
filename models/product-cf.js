module.exports=(sequelize,DataTypes)=>{
    const ProductCf=sequelize.define('ProductCf',{
		xproductid: {
			type: DataTypes.INTEGER(19),
			defaultValue: 0,
			primaryKey:true,
		},
		cf_products_product_manufacturer: {
			type: DataTypes.STRING(255),
			defaultValue: '',
		},
		cf_products_division: {
			type: DataTypes.STRING(255),
			defaultValue:'',
		},
		cf_products_base_uom: {
			type: DataTypes.STRING(100),
			defaultValue: '',
		},
		cf_products_uom1: {
			type: DataTypes.STRING(100),
			defaultValue:'' ,
		},
		cf_products_uom2: {
			type: DataTypes.STRING(100),
			defaultValue:'',
		},
		cf_products_purchase_tax: {
			type: DataTypes.STRING(100),
			defaultValue:'',
		},
		cf_products_sales_tax: {
			type: DataTypes.STRING(100),
			defaultValue: '',
		},
		cf_products_contect: {
			type: DataTypes.STRING(100),
			defaultValue: '',
		},
		cf_products_flavour: {
			type: DataTypes.STRING(100),
			defaultValue:'',
		},
		cf_products_pack: {
			type: DataTypes.STRING(100),
			defaultValue:'',
		},
		cf_products_track_pkd: {
			type: DataTypes.STRING(100),
			defaultValue:'',
		},
		cf_products_vat: {
			type: DataTypes.STRING(255),
			defaultValue: '',
		},
		cf_products_price_at_uom: {
			type: DataTypes.STRING(200),
			defaultValue: '',
		},
		cf_products_track_batch: {
			type: DataTypes.STRING(250),
			defaultValue: '',
		},
		cf_products_stock_norm: {
			type: DataTypes.STRING(200),
			defaultValue: '',
		},
		cf_products_pts: {
			type: DataTypes.STRING(200),
			defaultValue:'',
		},
		cf_products_ecp: {
			type: DataTypes.STRING(200),
			defaultValue:'',
		},
		cf_products_minimum_order_quantity: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		cf_products_ptr: {
			type: DataTypes.STRING(200),
			defaultValue:'',
		},
		cf_products_mrp: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		cf_products_reporting_unit: {
			type: DataTypes.STRING(100),
			defaultValue:'',
		},
		cf_products_reporting_uom: {
			type: DataTypes.STRING(100),
			defaultValue: '',
		},
		cf_products_conversion_factor: {
			type: DataTypes.STRING(100),
			defaultValue: '',
		},
		cf_products_conversion_unit: {
			type: DataTypes.STRING(256),
			defaultValue: '',
		},
		cf_products_uom1_conversion: {
			type: DataTypes.STRING(256),
			defaultValue: '',
		},
		cf_products_uom2_conversion: {
			type: DataTypes.STRING(256),
			defaultValue: '',
		},
		cf_products_forum_code: {
			type: DataTypes.STRING(256),
			defaultValue:'',
		},
		cf_products_product_description: {
			type: DataTypes.TEXT,
			defaultValue:'',
		},
		cf_products_product_level: {
			type: DataTypes.STRING(100),
			defaultValue: '',
		},
    },{
        tableName:'vtiger_xproductcf',
        timestamps:false,
        freezeTableName:true,
    });
     ProductCf.belongsTo(sequelize.models.Product,{
            foreignKey:'xproductid',
            targetKey:'xproductid',
     });

    return ProductCf;
};