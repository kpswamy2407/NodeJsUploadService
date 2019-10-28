module.exports=(sequelize,DataTypes,Sequelize)=>{
    const SendRecAudit=sequelize.define('SendRecAudit',{
        sen_rec_id:{
            type:DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        sen_rec_doc_name:{
            type:DataTypes.STRING(250),
        },

        sen_rec_options:{
            type:DataTypes.STRING(250),
        },

        sen_rec_documenttype:{
            type:DataTypes.STRING(250),
        },

        sen_rec_distcode:{
            type:DataTypes.STRING(250),
        },

        sen_rec_status:{
            type:DataTypes.STRING(250),
        },

        sen_rec_reason:{
            type:DataTypes.STRING(250),
        },

        sen_rec_recordid:{
            type:DataTypes.STRING(250),
        },
         sen_rec_sourceapplication:{
            type:DataTypes.STRING(250),
        },
         sen_rec_destapplication:{
            type:DataTypes.STRING(250),
        },
         sen_rec_doc_createddate:{
            type:DataTypes.STRING(250),
        },
        sen_rec_rawurl:{
            type:DataTypes.STRING(250),
        },
        sen_rec_createddate:{
            type: 'TIMESTAMP',
            allowNull: false
        },
        
    },{
        tableName:'sify_send_receive_audit',
        timestamps:false,
        freezeTableName:true,
        indexes: [ 
        { fields: [ 'sen_rec_recordid' ] },
        { fields:['sen_rec_documenttype']},
        { fields:['sen_rec_distcode']},
        ],
    });
    return SendRecAudit;
};