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
    this.sType=subject.sType;
};

var tempsubject=new Subject({
    sID:100,
    sName:'课程名称',
    sUIDofTea:200,
    sDescrip:"asfa sf af ",
    sPicture:"img/test.png",
    sFollowerNum:250,
    sType:"presentProgram"
});

/*
 获取指定数量 最推荐的课程
 算法方式：关注者最多or别的
 return:得到的subject数组
 */
Subject.getMostRecSubjects=function getMostRecSubjects(needSubNum,callback){

    //数据库操作，目前为桩
    var subPopList=[
        new Subject(tempsubject),
        new Subject(tempsubject),
        new Subject(tempsubject),
        new Subject(tempsubject)
    ];
    return subPopList; //or callback(databaseerr,subPoplist);
};

//存放全部课程首页 各显示内容的tab中的subjectList
var typeSubjectList={
    allclass:[],
    presentProgram:[],
    dataStructureType:[],
    programDesign:[],
    basicAlgorithm:[],
    lineStructure:[],
    treeStructure:[],
    divideConquer:[],
    dynamicPrograming:[],
    search:[],
    graphTheory:[],
    numberTheory:[],
    groupTheory:[],
    computationGeometry:[],
    others:[]
};

//存放所有课程的细分类
var allType={
    programBasic:[
        '程序的表示','数据结构类型','程序设计','基本算法'
    ],
    dataStructure:[
        '线性结构','树形结构'
    ],
    algorithm:[
        '分治','动态规划','搜索','图论','数论','群论','计算几何','其他'
    ]
}

//返回给全部课程页面的object对象，包含页面所需信息
var AllSubjectShowObject={
    isIntial:false,
    isChange:false,//从数据库拿一次之后初始化，一旦有更改，再重新拿
    tySuList:typeSubjectList,
    programBasic:{
        mainNode:new TypeNode({smallType:"programBasic",typeName:"程序设计基础"}),
        basicProNodeList:[
            new TypeNode({smallType:"presentProgram",typeName:"程序的表示"}),
            new TypeNode({smallType:"dataStructureType",typeName:"数据结构类型"}),
            new TypeNode({smallType:"programDesign",typeName:"程序设计"}),
            new TypeNode({smallType:"basicAlgorithm",typeName:"基本算法"})
        ]
    },
    dataStructure:{
        mainNode:new TypeNode({smallType:"dataStructure",typeName:"数据结构"}),
        dataStrNodeList:[
            new TypeNode({smallType:"lineStructure",typeName:"线性结构"}),
            new TypeNode({smallType:"treeStructure",typeName:"树形结构"})
        ]
    },
    algorithm:{
        mainNode:new TypeNode({smallType:"algorithm",typeName:"算法分类"}),
        algorithmNodeList:[
            new TypeNode({smallType:"divideConquer",typeName:"分治"}),
            new TypeNode({smallType:"dynamicPrograming",typeName:"动态规划"}),
            new TypeNode({smallType:"search",typeName:"搜索"}),
            new TypeNode({smallType:"graphTheory",typeName:"图论"}),
            new TypeNode({smallType:"numberTheory",typeName:"数论"}),
            new TypeNode({smallType:"groupTheory",typeName:"群论"}),
            new TypeNode({smallType:"computationGeometry",typeName:"计算几何"}),
            new TypeNode({smallType:"others",typeName:"其他"})
        ]
    }
};

/*
每一个小分类的类型
 */
function TypeNode(typenode){
    //this.mainType=typenode.mainType;
    this.smallType=typenode.smallType;//界面tabref
    this.typeName=typenode.typeName;//中文界面显示
    //this.subjectList=typenode.subjectList;
}

//全部课程页面调用这个方法得到所需对象
Subject.getAllSubjectShow= function getAllSubjectShow(){
    if(AllSubjectShowObject.isIntial==false){
        Subject.initialTypeSubjectList();
    }
    return AllSubjectShowObject;
};

//遍历一遍subject数据库，每门课都放到allclass中,其他查询标签，有那个就push到typeSubjectList['']中
//全部课程页面真正与数据库操作的部分
Subject.initialTypeSubjectList= function () {
    typeSubjectList.allclass.push(tempsubject);
    typeSubjectList.allclass.push(tempsubject);
    typeSubjectList.allclass.push(tempsubject);
    typeSubjectList.allclass.push(tempsubject);
    typeSubjectList.allclass.push(tempsubject);

    typeSubjectList.lineStructure.push(tempsubject);
    typeSubjectList.lineStructure.push(tempsubject);
    typeSubjectList.lineStructure.push(tempsubject);
    typeSubjectList.lineStructure.push(tempsubject);

    typeSubjectList.presentProgram.push(tempsubject);
    typeSubjectList.presentProgram.push(tempsubject);
    typeSubjectList.presentProgram.push(tempsubject);

    typeSubjectList.basicAlgorithm.push(tempsubject);
    typeSubjectList.basicAlgorithm.push(tempsubject);
    typeSubjectList.basicAlgorithm.push(tempsubject);
    typeSubjectList.basicAlgorithm.push(tempsubject);

    typeSubjectList.others.push(tempsubject);
    typeSubjectList.others.push(tempsubject);

    AllSubjectShowObject.isIntial=true;
};


module.exports=Subject;
