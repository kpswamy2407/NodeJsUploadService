module.exports=(sequelize,DataTypes)=>{
    const DmsProcessXmlStatus=sequelize.define('DmsProcessXmlStatus',{
        id:{
            type:DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        context:{
            type:DataTypes.TEXT,
        },
        service_name:{
            type:DataTypes.STRING(255),
        },
        status:{
            type:DataTypes.INTEGER(2),
            defaultValue:0,
        },
        start_time:{
            type:DataTypes.DATE,
        },
        end_time:{
            type:DataTypes.DATE,
            defaultValue:null,
        },
    },{
        tableName:'dms_process_xml_status',
        timestamps:false,
        freezeTableName:true,
    });
    DmsProcessXmlStatus.removeAttribute('id');
    return DmsProcessXmlStatus;
};