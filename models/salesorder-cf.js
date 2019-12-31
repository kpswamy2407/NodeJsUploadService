module.exports=(sequelize,DataTypes)=>{
    const SalesOrderCf=sequelize.define('SalesOrderCf',{
        salesorderid: {
            type: DataTypes.INTEGER(19),
            defaultValue:0,
        },
        cf_salesorder_sales_order_date: {
            type: 'DATE',
            defaultValue:null,
        },
        cf_salesorder_transaction_series: {
            type: DataTypes.STRING(200),
            defaultValue:null,
        },
        cf_salesorder_transaction_number: {
            type: DataTypes.STRING(50),
            defaultValue:null,
        },
        cf_salesorder_send_to_buyer: {
            type: DataTypes.STRING(3),
            defaultValue:null,
        },
        cf_xsalesorder_sales_man: {
            type: DataTypes.BIGINT(20),
            defaultValue:null,
        },
        cf_xsalesorder_beat: {
            type: DataTypes.BIGINT(20),
            defaultValue:null,
        },
        cf_xsalesorder_credit_term: {
            type: DataTypes.STRING(100),
            defaultValue:null,
        },
        cf_xsalesorder_type: {
            type: DataTypes.STRING(255),
            defaultValue:null,
        },
        cf_xsalesorder_next_stage_name: {
            type: DataTypes.STRING(50),
            defaultValue:null,
        },
        cf_xsalesorder_buyer_id: {
            type: DataTypes.STRING(100),
            defaultValue:null,
        },
        cf_xsalesorder_seller_id: {
            type: DataTypes.STRING(100),
            defaultValue:null,
        },
        cf_xsalesorder_billing_address_pick: {
            type: DataTypes.STRING(255),
            defaultValue:null,
        },
        cf_xsalesorder_shipping_address_pick: {
            type: DataTypes.STRING(255),
            defaultValue:null,
        },
        cf_xsalesorder_reason: {
            type: DataTypes.STRING(200),
            defaultValue:null,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue:null,
        },
        modified_at: {
            type: DataTypes.DATE,
            defaultValue:null,
        },
        deleted: {
            type: DataTypes.INTEGER(1),
        },
    },{
        tableName:'vtiger_xsalesordercf',
        timestamps:false,
        freezeTableName:true,
    });
    SalesOrderCf.removeAttribute('id');
    return SalesOrderCf;
};