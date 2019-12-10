module.exports=(sequelize,DataTypes)=>{
    const WorkFlow=sequelize.define('WorkFlow',{
        workflowid:{
            type:DataTypes.INTEGER(11),
            defaultValue:null,
        },
        workflowno:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        workflow_name:{
            type:DataTypes.STRING(255),
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
        tableName:'vtiger_workflow',
        timestamps:false,
        freezeTableName:true,
        indexes: [ { fields: [ 'workflowid' ] } ],
    });
    return WorkFlow;
};