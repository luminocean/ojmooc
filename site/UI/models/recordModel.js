/**
 * Created by zy on 2015/4/10.
 */

function RecordModel(recordModel){
    this.rID=recordModel.rID;
    this.rName=recordModel.rName;
    this.rUIDofTea=recordModel.rUIDofTea;
}

RecordModel.prototype.save=function save(callback){

};

RecordModel.get=function get(rID,callback){

};

module.exports=RecordModel;
