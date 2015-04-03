/**
 * Created by zy on 2015/4/1.
 */

//单个课程实例

function Subject(subject){
    this.sID=subject.sID;
    this.sName=subject.sName;
    this.sUIDofTea=subject.sUIDofTea;
    this.sDescrip=subject.sDescrip;
    this.sPicture=subject.sPicture;
    this.sFollowerNum=subject.sFollowerNum;
};

var subject=new Subject({
    sID:100,
    sName:'课程名称',
    sUIDofTea:200,
    sDescrip:"asfa sf af ",
    sPicture:"img/test.png",
    sFollowerNum:250
});

/*
 获取指定数量 最推荐的课程
 算法方式：关注者最多or别的
 return:得到的subject数组
 */
Subject.getMostRecSubjects=function getMostRecSubjects(needSubNum,callback){

    //数据库操作，目前为桩
    var subPopList=[
        new Subject(subject),
        new Subject(subject),
        new Subject(subject),
        new Subject(subject)
    ];
    return subPopList; //or callback(databaseerr,subPoplist);
};


module.exports=Subject;
