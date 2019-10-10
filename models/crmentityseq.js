'use strict';
module.exports = (sequelize, DataTypes) => {
    const CrmEntitySeq = sequelize.define('CrmEntitySeq', {
        id:{
            type:'INT(11)',
            primaryKey:true,
        },
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'vtiger_crmentity_seq',
        name:{
            singular:'crmentity',
            plural:'crmentities',
        } 
    });
    CrmEntitySeq.fnxtIncrement=function(){
        return CrmEntitySeq.findOne()
            .then(function(seq){
                return seq.increment('id');
            })
            .then(function(){
                return CrmEntitySeq.findOne()
            })
            .then(function(seq){
                return seq.id;
            })
            .catch(function(err){
                throw new Error('Error while incrementing the sequence.');
            });
    };
    CrmEntitySeq.associate = function (models) {
        // associations can be defined here
    };
    return CrmEntitySeq;
};