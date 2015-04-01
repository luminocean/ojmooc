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
    this.username = user.username;
    this.password = user.password;
    this.identity=user.identity;
};

module.exports = User;

User.prototype.save = function save(callback) {
    // 存入 mysql

    var saveUser_params=[null,this.username,this.password,this.identity];

    conn.query(saveUser,saveUser_params,function(err,rows){
        if(err){
            return callback("saveQuery:"+err);
        }
        console.log("INSERT Return ==> ");
        console.log(rows);
    });

    callback();
};


/*
根据username，检查是否有相应的用户
return :是否有
 */
User.check = function check(username, callback) {

    conn.query(queryUserByName,username, function (err2, rows) {
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
User.get = function get(username, callback) {

    conn.query(queryUserByName,username, function (err2, rows) {
        if (err2) //console.log(err2);
            return callback(err2);

        console.log("SELECT ==> ");
        for (var i in rows) {
            console.log(rows[i]);
        }

        if(rows.length==1){
            var user = new User({
                username: rows[0].username,
                password: rows[0].password,
                identity: rows[0].identity
            });
            console.log("aa"+rows[0].username);
            console.log("aa"+rows[0].password);

            return callback("",user);
        }

    });
};