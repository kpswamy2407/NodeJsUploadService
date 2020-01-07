module.exports=(sequelize,DataTypes)=>{
    const SaleXBatchInfo=sequelize.define('SaleXBatchInfo',{
		id: {
			type: DataTypes.BIGINT(20),
			autoIncrement:true,
			primaryKey:true,
		},
		transaction_id: {
			type: DataTypes.BIGINT(20),
			
		},
		trans_line_id: {
			type: DataTypes.BIGINT(20),
			
		},
		product_id: {
			type: DataTypes.BIGINT(20),
			
		},
		batch_no: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		pkd: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		expiry: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		transaction_type: {
			type: DataTypes.STRING(250),
		},
		sqty: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		sqty_st: {
			type: DataTypes.ENUM('S','SF','D','DF','QVR','Expired','Shortage',''),
			defaultValue: null,
		},
		sfqty: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: null,
		},
		sfqty_st: {
			type: DataTypes.ENUM('S','SF','D','DF','QVR','Expired','Shortage',''),
			defaultValue: null,
		},
		dqty: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: 0,
		},
		dqty_st: {
			type: DataTypes.ENUM('S','SF','D','DF','QVR','Expired','Shortage',''),
			defaultValue: null,
		},
		dfqty: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue: 0,
		},
		dfqty_st: {
			type: DataTypes.ENUM('S','SF','D','DF','QVR','Expired','Shortage',''),
			defaultValue: null,
		},
		ptr: {
			type: DataTypes.DECIMAL(25,6),
		},
		pts: {
			type: DataTypes.DECIMAL(25,6),
		},
		mrp: {
			type: DataTypes.DECIMAL(25,6),
			defaultValue:0.000000,
		},
		ecp: {
			type: DataTypes.DECIMAL(25,6),
		},

		ptr_type: {
			type: DataTypes.STRING(256),
			defaultValue: null,
		},
		distributor_id: {
			type: DataTypes.BIGINT(20),
			
		},
		created_dtm: {
			type: DataTypes.DATE,
		},
		reconcile: {
			type: DataTypes.STRING(256),
			defaultValue: null,
		},
		track_serial: {
			type: DataTypes.INTEGER(1),
			defaultValue: 0,
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
        tableName:'vtiger_xsalestransaction_batchinfo',
        timestamps:false,
        freezeTableName:true,
        indexes: [ 
        {fields: [ 'trans_line_id' ] },
        {fields:['transaction_id']},
        {fields:['transaction_type']},
        {fields:['transaction_id','product_id']},
        {fields:['transaction_type']}]
    });
    
    return SaleXBatchInfo;
};