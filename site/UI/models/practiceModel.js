/**
 * Created by zy on 2015/4/10.
 */

function PracticeModel(practicemodel){
    this.pID=practicemodel.pID;
    this.pName=practicemodel.pName;
    this.pUIDofTea=practicemodel.pUIDofTea;
    this.pDescrip=practicemodel.pDescrip;
    this.pInputFormat=practicemodel.pInputFormat;
    this.pOutputFormat=practicemodel.pOutputFormat;
    this.pInputFormatList=practicemodel.pInputFormatList;//list
    this.pOutputFormatList=practicemodel.pOutputFormatList;//list
    this.pFormatListLength=practicemodel.pFormatListLength;
}
//
//var tempPractice=new PracticeModel({
//    pID:12345,
//    pName:"pname111",
//    pUIDofTea:999,
//    pDescrip:"afakjf asfhakjfhalskfhaskf  asfjahfajkhfask sj asjkfhaksfhak jhfakhfaks啊发生发生发撒旦发时代发生阿斯发发啊阿斯发发阿斯发啊发阿斯发",
//    pInputFormat:"ooooooooooooooooo 啊发阿斯发阿斯发是啊",
//    pOutputFormat:"ppppppppppppppppp 啊发是否我uqoiruqwoiruqwr  ",
//    pFormatListLength:3,
//    pInputFormatList:["afsdfhaskfjhas 啊发发生","发生 分萨芬"," 啊发  啊发是否阿斯发"],
//    pOutputFormatList:["afsdfhaskfjhas 啊发发生","发生 分萨芬"," 啊发  啊发是否阿斯发"]
//});

var tempPractice=new PracticeModel({
    pID:222,
    pName:"pname111",
    pUIDofTea:999,
    pDescrip:"uuuuuuuuu",
    pInputFormat:"ooooooooooooooooo ",
    pOutputFormat:"ppppppppppppppppp ",
    pFormatListLength:3,
    pInputFormatList:["afsdfhaskfjhas 啊发发生","发生 分萨芬"," 啊发  啊发是否阿斯发"],
    pOutputFormatList:["afsdfhaskfjhas 啊发发生","发生 分萨芬"," 啊发  啊发是否阿斯发"]
});

PracticeModel.prototype.save=function save(parentid,callback){
    //数据库存储
    console.log("psave");
    console.log(this);
    tempPractice=this;
    //存储parentid
    //存储parentid之中的callback中再执行本函数的callback
    callback();
};

PracticeModel.prototype.update=function update(callback){
    //数据库更新自身除了id之外所有可能的信息，根据pid更新
    tempPractice=this;
    //存储parentid
    //存储parentid之中的callback中再执行本函数的callback
    callback();
};

PracticeModel.get=function get(pID,callback){

    return callback("",tempPractice);
};

module.exports=PracticeModel;


