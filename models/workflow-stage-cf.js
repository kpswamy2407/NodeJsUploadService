var WorkFlowCf=require('./workflow-cf');
module.exports=(sequelize,DataTypes)=>{
    const WFStageCf=sequelize.define('WFStageCf',{
        workflowstageid:{
            type:DataTypes.INTEGER(11),
            primaryKey: true,
        },
        cf_workflowstage_possible_action:{
            type:DataTypes.STRING(100),
            defaultValue:'',
        },
        cf_workflowstage_next_stage:{
            type:DataTypes.STRING(255),
            defaultValue:'',
        },
        cf_workflowstage_next_content_status:{
            type:DataTypes.STRING(100),
            defaultValue:'',
        },
        cf_workflowstage_user_role:{
            type:DataTypes.STRING(100),
            defaultValue:'',
        },
        cf_workflowstage_business_logic:{
            type:DataTypes.STRING(100),
            defaultValue:'',
        },
        cf_workflowstage_workflow_id:{
            type:DataTypes.STRING(100),
            defaultValue:'',
        },
        cf_workflowstage_stage_name:{
            type:DataTypes.STRING(100),
            defaultValue:'',
        },
        cf_workflowstage_comment:{
            type:DataTypes.STRING(100),
            defaultValue:'',
        },
        cf_workflowstage_current_status:{
            type:DataTypes.STRING(100),
            defaultValue:'',
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
        
    },{
        tableName:'vtiger_workflowstagecf',
        timestamps:false,
        freezeTableName:true,
        indexes: [ { fields: [ 'workflowstageid','cf_workflowstage_stage_name' ] },
            {fields:['cf_workflowstage_user_role']},{fields:['cf_workflowstage_stage_name']} ],
    });
    //WFStageCf.belongsTo(sequelize.models.WorkFlowCf);
    return WFStageCf;
};