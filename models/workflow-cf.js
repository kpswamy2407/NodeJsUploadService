var WFStageCf=require('./workflow-stage-cf');
module.exports=(sequelize,DataTypes)=>{
    const WorkFlowCf=sequelize.define('WorkFlowCf',{
        workflowid:{
            type:DataTypes.INTEGER(11),
            primaryKey: true,
        },
        cf_workflow_module:{
            type:DataTypes.STRING(100),
            defaultValue:null,
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
        tableName:'vtiger_workflowcf',
        timestamps:false,
        freezeTableName:true,
        indexes: [ { fields: [ 'cf_workflow_module' ] } ],
    });
    WorkFlowCf.hasMany(sequelize.models.WFStageCf,{
            sourceKey:'workflowid',
            foreignKey:'cf_workflowstage_workflow_id',
    });
    return WorkFlowCf;
};