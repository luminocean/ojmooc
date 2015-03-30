var conn=require('../database/dbHelper');


var insertSQL = 'insert into t_user(name) values("conan"),("fens.me")';
var selectSQL = 'select * from t_user limit 10';
var deleteSQL = 'delete from t_user';
var updateSQL = 'update t_user set name="conan update"  where name="conan"';

var queryUserByName = 'select * from user where user.name=?';

var saveUser= 'insert into user values(?,?,?)';

/**
 * Created by zy on 2015/3/23.
 */

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.identity=user.identity;
};

module.exports = User;

User.prototype.save = function save(callback) {
    // 存入 mysql
    var user = {
        name: this.name,
        password: this.password,
        identity:this.identity
    };

    var saveUser_params=[null,user.name,user.identity];

    conn.query(saveUser,saveUser_params,function(err,rows){
        if(err){
            return callback(err);
        }
        console.log("INSERT Return ==> ");
        console.log(rows);
    });

    callback();
};
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