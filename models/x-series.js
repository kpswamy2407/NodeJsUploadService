module.exports=(sequelize,DataTypes)=>{
    const XSeries=sequelize.define('XSeries',{
        xtransactionseriesid:{
            type:DataTypes.INTEGER(11),
            primaryKey: true,
            defaultValue:null,
        },
        transactionseriesname:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        transactionseriescode:{
            type:DataTypes.STRING(255),
            defaultValue:null,
        },
        cf_xtransactionseries_user_id:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        xdistributorid:{
            type:DataTypes.INTEGER(11),
            defaultValue:null,
        },
        tinnumber:{
            type:DataTypes.STRING(100),
            defaultValue:null,
        },
        fiscal_finance:{
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
        tableName:'vtiger_xtransactionseries',
        timestamps:false,
        freezeTableName:true,
        indexes: [ 
        {fields: [ 'xtransactionseriesid' ] },
        {fields:['xtransactionseriesid','cf_xtransactionseries_user_id','xdistributorid']},
        {fields:['xdistributorid']},
        {fields:['cf_xtransactionseries_user_id','xdistributorid']}],
    });
    return XSeries;
};