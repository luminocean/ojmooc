var conn=require('../database/dbHelper');


var insertSQL = 'insert into t_user(name) values("conan"),("fens.me")';
var selectSQL = 'select * from t_user limit 10';
var deleteSQL = 'delete from t_user';
var updateSQL = 'update t_user set name="conan update"  where name="conan"';

var queryUserByName = 'select * from user where user.username=?';

var saveUser= 'insert into user values(?,?,?,?)';

/**
 * Created by zy on 2015/3/23.
 */

function User(user) {
    this.uID=user.uID;
    this.uUserName = user.uUserName;
    this.uPassWord = user.uPassWord;
    this.uIdentity=user.uIdentity;// 0为学生，没有follower，
                                  // 1为老师
    this.uDescrip=user.uDescrip;
    this.uSchool=user.uSchool;
    this.Lastmid=user.Lastmid;
    this.uPicture=user.uPicture;
    this.uFollowerNum=user.uFollowerNum;//老师才有，关注者
    this.uRecordInfo=user.uRecordInfo;//老师才有，视频库信息json
    this.uPracticeInfo=user.uPracticeInfo;//老师才有，习题库信息json
};

var tempUser=new User({
    uID:11,
    uUserName:"fff",
    uPassWord:"fff",
    uIdentity:1,
    uDescrip:"vvvvvvvvvvvvvvvvvvvvv",
    uSchool:"nanjing university",
    Lastmid:56,
    uPicture:"img/test.png",
    uFollowerNum:500,
    uRecordInfo:[
        { "id" : "ajson1", "parent" : "#", "text" : "Simple root node","type":"record","a_attr":{"href":"/play"}},
        { "id" : "ajson2", "parent" : "#", "text" : "Root node 2" ,"type":"default","state":{"disabled":"true"}},
        { "id" : "ajson3", "parent" : "ajson2", "text" : "Child 2" ,"type":"default"},
        { "id" : "ajson4", "parent" : "ajson2", "text" : "Child 1","type":"record" },
    ],
    uPracticeInfo:[
        { "id" : "ajson11", "parent" : "#", "text" : "Simple root node11","type":"practice"},
        { "id" : "ajson22", "parent" : "#", "text" : "Root node 22" ,"type":"default"},
        { "id" : "ajson33", "parent" : "ajson22", "text" : "Child 22" ,"type":"default"},
        { "id" : "ajson44", "parent" : "ajson22", "text" : "Child 11","type":"practice"},
    ]
});


User.prototype.save = function save(callback) {
    // 存入 mysql

    var saveUser_params=[null,this.uUserName,this.uPassWord,this.uIdentity];

    conn.query(saveUser,saveUser_params,function(err,rows){
        if(err){
            return callback("saveQuery:"+err);
        }
        console.log("INSERT Return ==> ");
        console.log(rows);

        callback();
    });

    console.log("uuuuu");
};


/*
根据username，检查是否有相应的用户
return :是否有
 */
User.check = function check(uUserName, callback) {

    conn.query(queryUserByName,uUserName, function (err2, rows) {
        if (err2) //console.log(err2);
            return callback(err2);

        console.log("SELECT ==> ");
        for (var i in rows) {
            console.log(rows[i]);
        }

        if(rows.length==1){
            return callback("Username already exists.");
        }

        callback();

    });
};

/*
return 根据username得到 返回相应的user
 */
User.get = function get(uUserName, callback) {

    conn.query(queryUserByName,uUserName, function (err2, rows) {
        if (err2) //console.log(err2);
            return callback(err2);

        console.log("SELECT ==> ");
        for (var i in rows) {
            console.log(rows[i]);
        }

        if(rows.length==1){
            //后面row中取值的话，需要用数据库的表示
            var getuser = new User({
                uUserName:rows[0].username,
                uPassWord:rows[0].password,
                uIdentity:rows[0].identity
            });
            console.log("aa"+rows[0].username);
            console.log("aa"+rows[0].password);

            if(getuser instanceof User){
                console.log("getuser it;s true");
            }else{
                console.log("getuser it;s false");
            }

            return callback("",getuser);
        }

    });
};


//学生选课信息 的返回对象，还未使用
function StuChooseSub(stuChooseSub){
    this.uID=stuChooseSub.uID;
    this.sID=stuChooseSub.sID;
    this.lastStudy=stuChooseSub.lastStudy;
    this.lastStudyTime=stuChooseSub.lastStudyTime;
    this.status=stuChooseSub.status; //0：还没有开始，1：已经开始resume，2：已完成
    this.isFocus=stuChooseSub.isFocus;//0：没有关注，1：已关注
};

var returnThing={
    uID:123,
    sID:223,
    lastStudy:"llllllastStudyafaf af",
    lastStudyTime:"afa",
    status:1,
    //上边找一个表就好，下面三个得分别去各自表
    sName:"subjectName",
    sPicture:"img/test.png",
    sFollowerNum:345,
    teacherName:"teacherName"
};


/*
 学生使用
 return 根据要求的num ,返回我最近选择的指定数量课程

 若num为0，返回所有的选择的课程
 */
User.prototype.getMyStudyingClasses = function getMyStudyingClasses(getNum, callback) {
    //根据userID，找到他正在上的课程

    var chooseSubList=[
        returnThing,
        returnThing,
        returnThing
    ];

    return chooseSubList;
};

/*
 学生使用
 学生我的课程页面所有关于课程信息的展示 关注 已学 已完成

 若num为0，返回所有的选择的课程
 */
User.prototype.getallMySubjectInfo = function getallMySubjectInfo(callback) {
    //根据userID，遍历StuChooseSub表一次，填充返回的object

    var allMySubjectInfoObject={
        classFocus:[
            returnThing,
            returnThing,
            returnThing
        ],
        classStudying:[
            returnThing,
            returnThing,
            returnThing,
            returnThing,
            returnThing,
            returnThing
        ],
        classFinish:[
            returnThing,
            returnThing,
            returnThing
        ]
    };

    return allMySubjectInfoObject;
};

/*
 学生使用
 用于学生的我的课程显示
 return 我自己的所有信息的User对象
 */
User.prototype.getallInfoOfStudent =function getallInfoOfStudent(callback){
    //查询找到我的所有信息
    //和登录时查找到的对象一样，也可以那时就存储
    return tempUser;
};


/*
 老师使用
 返回我的基本信息用于老师的我的课程显示
 return 我自己的所有信息的User对象
 */
User.prototype.getallInfoOfTeacher =function getallInfoOfTeacher(callback){
    //查询找到我的所有信息
    //和登录时查找到的对象一样，也可以那时就存储
    return tempUser;
};

/*
 老师使用
 处理更新我的视频库信息
 return 我自己的所有信息的User对象
 */
User.prototype.handleRecordUpdate =function handleRecordUpdate(query,res,callback){
    //操作当前user的recordList对象
    switch (query.operation){
        case 'delete_node':
            console.log("delete");
            for(var i=0;i<tempUser.uRecordInfo.length;i++){//这里tempuser之后换成res.locals.user
                if(tempUser.uRecordInfo[i].id==query.id){
                    tempUser.uRecordInfo.splice(i,1);
                    res.send('true');
                }
            }
            break;
        case 'create_node':
            console.log("create");
            res.send('true');
            break;
        case 'rename_node':
            console.log("rename");
            res.send('true');
            break;
        case 'copy_node':
            console.log("copy");
            res.send();
            break;
        case 'move_node':
            console.log("move");
            res.send();
            break;
        default :
            concole.log("error operation!");
            res.send();
    }
    //console.log(tempUser.uRecordInfo);
};

/*
 老师使用
 处理更新我的视频库信息
 return 我自己的所有信息的User对象
 */
User.prototype.handlePracticeUpdate =function handlePracticeUpdate(query,res,callback){
    //操作当前user的recordList对象
    switch (query.operation){
        case 'delete_node':
            console.log("delete");
            for(var i=0;i<tempUser.uRecordInfo.length;i++){//这里tempuser之后换成res.locals.user
                if(tempUser.uRecordInfo[i].id==query.id){
                    tempUser.uRecordInfo.splice(i,1);
                    res.send('true');
                }
            }
            break;
        case 'create_node':
            console.log("create");
            res.send('true');
            break;
        case 'rename_node':
            console.log("rename");
            res.send('true');
            break;
        case 'copy_node':
            console.log("copy");
            res.send();
            break;
        case 'move_node':
            console.log("move");
            res.send();
            break;
        default :
            concole.log("error operation!");
            res.send();
    }
    //console.log(tempUser.uRecordInfo);
};

/*
 老师使用
 老师我的课程页面关闭，把视频库，习题库信息写入数据库
 */
User.prototype.myClassClose =function getRecordListJson(callback){
    //查询找到我的视频库信息
    //和登录时查找到的对象一样，也可以那时就存储
    //根据自身ID查找数据库
    return true;
};



/*
 老师使用
 查询找到我的视频库信息
 return 视频库JSON
 */
User.prototype.getRecordListJson =function getRecordListJson(callback){
    //查询找到我的视频库信息
    //和登录时查找到的对象一样，也可以那时就存储
    //根据自身ID查找数据库
    return JSON.stringify(tempUser.uRecordInfo);
};

/*
 老师使用
 查询找到我的视频库信息
 return 视频库JSON
 */
User.prototype.getPracticeListJson =function getPracticeListJson(callback){
    //查询找到我的视频库信息
    //和登录时查找到的对象一样，也可以那时就存储
    //根据自身ID查找数据库
    return JSON.stringify(tempUser.uPracticeInfo);
};



/*
 return 根据要求的num得到 返回首页最热门的几门推荐老师
 */
User.getMostRecTeachers = function getMostRecTeachers(getNum, callback) {
    var userList=[
        new User(tempUser),
        new User(tempUser),
        new User(tempUser),
        new User(tempUser)
    ];

    return userList;
};

/*
 return 返回所有老师的list，数据库检索Identity为1的
  要写成callback形式
 */
User.getAllTeacher = function getAllTeacher(callback) {
    var userList=[
        new User(tempUser),
        new User(tempUser),
        new User(tempUser),
        new User(tempUser),
        new User(tempUser),
        new User(tempUser)
    ];

    return userList;
};

module.exports = User;