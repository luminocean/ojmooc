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
    this.uFollowerNum=user.uFollowerNum;
    this.Lastmid=user.Lastmid;
    this.uPicture=user.uPicture;
};

var tempUser=new User({
    uID:11,
    uUserName:"fff",
    uPassWord:"fff",
    uIdentity:0,
    uDescrip:"vvvvvvvvvvvvvvvvvvvvv",
    uFollowerNum:500,
    Lastmid:56,
    uPicture:"img/test.png"
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
return 根据username得到 相应的user
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

//学生选课信息 的返回对象
function StuChooseSub(stuChooseSub){
    this.uID=stuChooseSub.uID;
    this.sID=stuChooseSub.sID;
    this.status=stuChooseSub.status; //还没有开始，还是已经开始resume
};


/*
 return 根据要求的num ,返回我最近选择的指定数量课程

 若num为0，返回所有的选择的课程
 */
User.prototype.getMyStudyingClasses = function getMyStudyingClasses(getNum, callback) {
    //根据userID，找到他正在上的课程
    console.log("this is in getMyStudyingClasses");
    var returnThing={
        subjectName:"subjectName",
        teacherName:"teacherName",
        subjectPicture:"img/test.png",
        status:true,
        lastStudy:"llllllastStudyafaf af",
        lastStudyTime:"afa"
    };
    var chooseSubList=[
        returnThing,
        returnThing,
        returnThing
    ];

    return chooseSubList;
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