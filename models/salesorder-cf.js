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
        cf_xrso_sales_man: {
            type: DataTypes.BIGINT(20),
            defaultValue:null,
        },
        cf_xrso_beat: {
            type: DataTypes.BIGINT(20),
            defaultValue:null,
        },
        cf_xrso_credit_term: {
            type: DataTypes.STRING(100),
            defaultValue:null,
        },
        cf_xrso_type: {
            type: DataTypes.STRING(255),
            defaultValue:null,
        },
        cf_xrso_next_stage_name: {
            type: DataTypes.STRING(50),
            defaultValue:null,
        },
        cf_xrso_buyer_id: {
            type: DataTypes.STRING(100),
            defaultValue:null,
        },
        cf_xrso_seller_id: {
            type: DataTypes.STRING(100),
            defaultValue:null,
        },
        cf_xrsalesorder_billing_address_pick: {
            type: DataTypes.STRING(255),
            defaultValue:null,
        },
        cf_xrsalesorder_shipping_address_pick: {
            type: DataTypes.STRING(255),
            defaultValue:null,
        },
        cf_xrsalesorder_reason: {
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
        tableName:'vtiger_xrsocf',
        timestamps:false,
        freezeTableName:true,
    });
    SalesOrderCf.removeAttribute('id');
    return SalesOrderCf;
};