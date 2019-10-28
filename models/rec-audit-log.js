module.exports=(sequelize,DataTypes,Sequelize)=>{
    const RecAuditLog=sequelize.define('RecAuditLog',{
        rec_log_id:{
            type:DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        rec_log_doc_name:{
            type:DataTypes.STRING(250),
        },

        rec_log_options:{
            type:DataTypes.STRING(250),
        },

        rec_log_documenttype:{
            type:DataTypes.STRING(250),
        },

        rec_log_distcode:{
            type:DataTypes.STRING(250),
        },

        rec_log_status:{
            type:DataTypes.STRING(250),
        },

        rec_log_reason:{
            type:DataTypes.STRING(250),
        },

        rec_log_recordid:{
            type:DataTypes.STRING(250),
        },
         rec_log_sourceapplication:{
            type:DataTypes.STRING(250),
        },
         rec_log_destapplication:{
            type:DataTypes.STRING(250),
        },
         rec_log_doc_createddate:{
            type:DataTypes.STRING(250),
        },
        rec_log_rawurl:{
            type:DataTypes.STRING(250),
        },
        rec_log_subject:{
            type:DataTypes.STRING(250),
        },
        rec_log_status_code:{
            type:DataTypes.STRING(250),
        },
        rec_log_status_msg:{
            type:DataTypes.STRING(250),
        },
        rec_log_createddate:{
            type: 'TIMESTAMP',
            allowNull: false
        },
        
    },{
        tableName:'sify_receive_audit_log',
        timestamps:false,
        freezeTableName:true,
        indexes: [ 
        { fields: [ 'rec_log_subject' ] },
        { fields:['rec_log_documenttype']},
        { fields:['rec_log_distcode']},
        ],
    });
    return RecAuditLog;
};