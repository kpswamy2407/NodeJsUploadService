module.exports=(sequelize,DataTypes)=>{
    const rSalesOrder=sequelize.define('rSalesOrder',{
        salesorderid:{
            type: DataTypes.INTEGER(19),
        },
        subject:{
            type: DataTypes.STRING(100),
            validate:{
                isExists:function(value,error) {
                        rSalesOrder.findOne({
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
            defaultValue:null,
        },
        adjustment:{
            type: DataTypes.DECIMAL(25,3),
            defaultValue:null,
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
            defaultValue:null,
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
        },
        next_stage_name:{
            type: DataTypes.STRING(50),
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
            defaultValue:null,
        },
        exciseduty:{
            type: DataTypes.DECIMAL(25,3),
            defaultValue:null,
        },
        latitude:{
            type: DataTypes.STRING(100),
            defaultValue:null,
        },
        longitude:{
            type: DataTypes.STRING(100),
            defaultValue:null,
        },
        transaction_start_time:{
            type: DataTypes.DATE,
            defaultValue:null,
        },
        transaction_end_time:{
            type: DataTypes.DATE,
            defaultValue:null,
        },
        session_id:{
            type: DataTypes.STRING(100),
            defaultValue:null,
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
        },
        lbl_rso_save_pro_cate:{
            type: DataTypes.STRING(20),
            set(val) {
                const invMgtConf=sequelize.models.InvMgtConfig;
                console.log(invMgtConf);
                  this.setDataValue('lbl_rso_save_pro_cate',true);
            }
        },
    },{
        tableName:'vtiger_xrso',
        timestamps:false,
        freezeTableName:true,

    });
    rSalesOrder.removeAttribute('id');
    rSalesOrder.afterCreate((rso,options)=>{
        console.log('hllll');
        //console.log(this.getDb());
    });
    rSalesOrder.afterSave((rso,options) => {
        
    /*
      
      var VtigerTab=this.sequelize.models['vTigerTab'];
      var CrmEntitySeq=this.sequelize.models['CrmEntitySeq'];
      Promise.all([vTigerTab.getSalesOrder(),CrmEntitySeq.fnxtIncrement()])
          .then(res => {
              var [tab, id]=res;
              var rsocrm=new CrmEntity({
                  crmid:id,
                  smcreatorid:1,
                  smownerid:1,
                  modifiedby:0,
                  setype:tab.name,
                  setype_id:tab.tabid,
                  description:null,
                  createdtime:new Date(),
                  modifiedtime:new Date(),
                  viewedtime:null,
                  status:null,
                  version:0,
                  presence:1,
                  deleted:0,
                  sendstatus:null,
                  terms_conditions:null,
              });
              return rsocrm.save();
          })
          .then(function(crm){
              return crm;
          })
          .catch( err => {
              throw new Error('Unable to create CRM entity for rSalesOrder.');
          })
      
    */});
    return rSalesOrder;
};