module.exports=(sequelize,DataTypes)=>{
    const Product=sequelize.define('Product',{
		xproductid: {
			type: DataTypes.INTEGER(11),
			defaultValue: null,
		},
		productname: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		productcode: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		length_of_serial_number: {
			type: DataTypes.INTEGER(11),
			defaultValue: null,
		},
		qtyinstock: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		type_of_serial_number: {
			type: DataTypes.STRING(15),
			defaultValue: null,
		},
		track_serial_number: {
			type: DataTypes.STRING(15),
			defaultValue: null,
		},
		track_refresh_cycle: {
			type: DataTypes.INTEGER(1),
			defaultValue: null,
		},
		track_refresh_noofdays: {
			type: DataTypes.INTEGER(3),
			defaultValue: null,
		},
		uom3: {
			type: DataTypes.INTEGER(20),
			defaultValue: null,
		},
		uom3_conversion: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		uom4: {
			type: DataTypes.INTEGER(20),
			defaultValue: null,
		},
		uom4_conversion: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		uom5: {
			type: DataTypes.INTEGER(20),
			defaultValue: null,
		},
		uom5_conversion: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		uom6: {
			type: DataTypes.INTEGER(20),
			defaultValue: null,
		},
		uom6_conversion: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		uom7: {
			type: DataTypes.INTEGER(20),
			defaultValue: null,
		},
		uom7_conversion: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		xproduct_content: {
			type: DataTypes.INTEGER(20),
			defaultValue: null,
		},
		xproduct_flavour: {
			type: DataTypes.INTEGER(20),
			defaultValue: null,
		},
		xproductgroupid: {
			type: DataTypes.BIGINT(20),
			defaultValue: null,
		},
		shotname: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		image_name: {
			type: DataTypes.BLOB,
			defaultValue: null,
		},
		xproduct_default_purchase_uom: {
			type: DataTypes.STRING(256),
			defaultValue: null,
		},
		xproduct_default_inventory_uom: {
			type: DataTypes.STRING(256),
			defaultValue: null,
		},
		xproduct_available_stock_disp_uom: {
			type: DataTypes.STRING(256),
			defaultValue: null,
		},
		gross_weight: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		net_weight: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		xproductpicklist1: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		xproductpicklist2: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		xproductpicklist3: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		xproductpicklist4: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		xproductpicklist5: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		xproductpicklist6: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		xproductpicklist7: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		xproductpicklist8: {
			type: DataTypes.STRING(100),
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
		hsncode: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		producttaxtype: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		allow_rate_edit: {
			type: DataTypes.INTEGER(1),
			defaultValue: 0,
		},
		classification: {
			type: DataTypes.STRING(100),
		},
		xproductflag1: {
			type: DataTypes.STRING(100),
		},
		xproductflag2: {
			type: DataTypes.STRING(100),
		},
		xproductflag3: {
			type: DataTypes.STRING(100),
		},
    },{
        tableName:'vtiger_xproduct',
        timestamps:false,
        freezeTableName:true,
        indexes:[
        {fields:['xproductid']},
        {fields:['productcode']}
        ]
    });
    Product.removeAttribute('id');
    return Product;
};