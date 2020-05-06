module.exports=(sequelize,DataTypes)=>{
    const SalesOrder=sequelize.define('SalesOrder',{
        salesorderid:{
            type: DataTypes.INTEGER(19),
        },
        subject:{
            type: DataTypes.STRING(100),
            validate:{
                isExists:function(value,error) {
                        SalesOrder.findOne({
                          where: {deleted: '0',subject:value},
                          attributes: ['salesorderid']
                        }).then(order => {
                          if(order){
                            error('Order already exists in the application');
                          }
                          else{
                            error();
                          }
                        }).catch(e=>{
                            error('Unable to validate the subject');
                        });
                }
            }
        },
        buyerid:{
            type: DataTypes.STRING(100),
            defaultValue:null,
        },
        salesorder_no:{
            type: DataTypes.STRING(100),
            defaultValue:null,
        },
        tracking_no:{
            type: DataTypes.STRING(100),
            defaultValue:null,
        },
        duedate:{
            type: DataTypes.STRING(25),
            defaultValue:null,
        },
        carrier:{
            type: DataTypes.STRING(200),
            defaultValue:null,
        },
        type:{
            type: DataTypes.INTEGER(11),
            defaultValue:10,
        },
        adjustment:{
            type: DataTypes.STRING(25),
            allowNull: false,
            defaultValue:'0.000',
        },
        is_taxfiled:{
            type:DataTypes.INTEGER(2),
            allowNull: false,
            defaultValue:0,
        },
        total:{
            type: DataTypes.DECIMAL(25,3),
            defaultValue:null,
        },
        subtotal:{
            type: DataTypes.DECIMAL(25,3),
            defaultValue:null,
        },
        taxtype:{
            type: DataTypes.STRING(25),
            defaultValue:null,
        },
        discount_percent:{
            type: DataTypes.DECIMAL(25,3),
            allowNull: false,
            defaultValue:0.000,
        },
        discount_amount:{
            type: DataTypes.DECIMAL(25,3),
            defaultValue:null,
        },
        s_h_amount:{
            type: DataTypes.DECIMAL(25,3),
            defaultValue:null,
        },
        terms_conditions:{
            type: DataTypes.TEXT,
            defaultValue:null,
        },
        status:{
            type: DataTypes.STRING(200),
            defaultValue:null,
        },
        currency_id:{
            type: DataTypes.INTEGER(19),
        },
        conversion_rate:{
            type: DataTypes.DECIMAL(10,3),
            defaultValue:'1.0',
        },
        next_stage_name:{
            type: DataTypes.STRING(50),
            defaultValue:'',
        },
        quoteid:{
            type: DataTypes.INTEGER(19),
            defaultValue:null,
        },
        requisition_no:{
            type: DataTypes.STRING(100),
            defaultValue:null,
        },
        contactid:{
            type: DataTypes.INTEGER(19),
            defaultValue:null,
        },
        salescommission:{
            type: DataTypes.DECIMAL(25,3),
            allowNull: false,
            defaultValue:0.000,
        },
        exciseduty:{
            type: DataTypes.DECIMAL(25,3),
            allowNull: false,
            defaultValue:0.000,
        },
        customer_type:{
            type: DataTypes.INTEGER(11),
        },
        distributor_id:{
            type: DataTypes.BIGINT(20),
        },
        created_at:{
            type: DataTypes.DATE,
        },
        modified_at:{
            type: DataTypes.DATE,
        },
        is_processed:{
            type: DataTypes.TINYINT(1),
        },
        deleted:{
            type: DataTypes.INTEGER(1),
            defaultValue:0,
        },
        conversion_version:{
            type:DataTypes.INTEGER(11),
            defaultValue:0,
        },
        order_scheme_points:{
            type:DataTypes.DECIMAL(25,6),
            defaultValue:null,
        },
        order_scheme_description:{
            type:DataTypes.TEXT,
            
        },
        order_scheme_discount:{
            type:DataTypes.DECIMAL(25,6),
            defaultValue:null,
        },
        so_lbl_save_pro_cate:{
            type:DataTypes.STRING(25),
        },
        trntaxtype:{
            type:DataTypes.STRING(25),
            defaultValue:null,
        },
        seller_state:{
            type:DataTypes.STRING(50),
            defaultValue:null,
        },
        buyer_state:{
            type:DataTypes.STRING(50),
            defaultValue:null,
        },
        seller_gstinno:{
            type:DataTypes.STRING(50),
            defaultValue:null,
        },
        buyer_gstinno:{
            type:DataTypes.STRING(50),
            defaultValue:null,
        },
        salesorder_status:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        xproductgroupid:{
            type:DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue:0,
        },
        billing_at:{
            type:DataTypes.STRING(25),
            defaultValue:null,
        }


    },{
        tableName:'vtiger_xsalesorder',
        timestamps:false,
        freezeTableName:true,

    });
    SalesOrder.removeAttribute('id');
    
       

       
    SalesOrder.afterSave((rso,options) => {});
    return SalesOrder;
};