module.exports=(sequelize,DataTypes)=>{
    const SoProdRel=sequelize.define('SoProdRel',{
		id: {
			type: DataTypes.INTEGER(19),
			defaultValue: null,
		},
		productid: {
			type: DataTypes.INTEGER(19),
			defaultValue: null,
		},
		productcode: {
			type: DataTypes.STRING(50),
			defaultValue: null,
		},
		product_type: {
			type: DataTypes.STRING(50),
			defaultValue: 'Main',
		},
		sequence_no: {
			type: DataTypes.INTEGER(4),
			defaultValue: null,
		},
		quantity: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		baseqty: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		tuom: {
			type: DataTypes.STRING(250),
			defaultValue: null,
		},
		listprice: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		discount_percent: {
			type: DataTypes.DECIMAL(7,3),
			defaultValue: null,
		},
		discount_amount: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		sch_disc_amount: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		description: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		comment: {
			type: DataTypes.STRING(250),
			defaultValue: null,
		},
		tax1: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		tax2: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		tax3: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		billing_at:{
			type: DataTypes.STRING(50),
			defaultValue:null,
		},
		ptr: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		mrp: {
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
		incrementondel: {
			type: DataTypes.INTEGER(11),
			defaultValue: 0,
		},
		xprodhierid: {
			type: DataTypes.BIGINT(20),
		},
		lineitem_id: {
			type: DataTypes.INTEGER(11),
			primaryKey:true,
			autoIncrement:true,
		},
		dispatchqty: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: 0,
		},
		siqty: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: 0,
		},
    },{
        tableName:'vtiger_xsalesorderproductrel',
        timestamps:false,
        freezeTableName:true,
        indexes: [ 
        {fields: [ 'id' ] },
        {fields:['productid']},
        {fields:['tuom']},
        {fields:['product_type']}]
    });
    return SoProdRel;
};