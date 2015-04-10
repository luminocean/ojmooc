/**
 * Created by zy on 2015/4/10.
 */

function Practicemodel(practicemodel){
    this.pID=practicemodel.pID;
    this.pName=practicemodel.pName;
    this.pUIDofTea=practicemodel.pUIDofTea;
    this.pDescrip=practicemodel.pDescrip;
    this.pInputFormat=practicemodel.pInputFormat;//list
    this.pOutputFormat=practicemodel.pOutputFormat;//list
    this.pFormatLength=practicemodel.pFormatLength;
}

var tempPractice=null;

Practicemodel.prototype.save=function save(callback){
    //数据库存储
    tempPractice=this;
    console.log("wao"+tempPractice);
    callback();
};

Practicemodel.get=function get(pname,callback){

};

module.exports=Practicemodel;


