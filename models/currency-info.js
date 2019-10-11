module.exports=(sequelize,DataTypes)=>{
    const CurrencyInfo=sequelize.define('CurrencyInfo',{
        id:{
            type:DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement:true,
        },
        currency_name:{
            type:DataTypes.STRING(255),
            defaultValue:null,

        },
        currency_code:{
            type:DataTypes.STRING(255),
            defaultValue:null,
        },
        currency_symbol:{
            type:DataTypes.STRING(30),
            defaultValue:null,
        },
        conversion_rate:{
            type:DataTypes.DECIMAL(10,3),
            defaultValue:null,
        },
        currency_status:{
            type:DataTypes.STRING(30),
            defaultValue:null,
        },
        defaultid:{
            type:DataTypes.STRING(30),
            defaultValue:'0',
        },
        deleted:{
             type:DataTypes.INTEGER,
            defaultValue:1,
        },
    },
    {
        tableName:'vtiger_currency_info',
        timestamps:false,
        freezeTableName:true,
        
    });
    return CurrencyInfo;
};