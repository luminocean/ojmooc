/**
 * Created by blueking on 2015/3/7.
 */
var mysql = require('mysql');
getConnect = function(){
    var connect = mysql.createConnection({
        host: '121.42.155.75',
        user: 'root',
        password: 'vagrant',
        database:'ojmooc',
        port: 3306
    });
    return connect;
}
exports.query_course_info = function(condition,value,callback) {
    var connect = getConnect();
    var table_name = 't_course_info';
    var database_name = 'ojmooc';
    connect.connect();
    connect.query("use " + database_name);

    connect.query(
        'SELECT * FROM '+table_name + ' where ' + condition + ' = ?', [value], function (err, results, fields) {
            if (err) {
                callback(err);
            }

            if (results) {
                callback(null,results);
            }
            connect.end();
        });
}

exports.insert_course_info = function(values){
    var connect = getConnect();
    var table_name = 't_course_info';
    var database_name = 'ojmooc';
    connect.connect();
    connect.query("use " + database_name);
    connect.query('insert into ' + table_name + ' set ?',values,function(err,result){
        if(err){
            console.log(err);
        }
        else {
            console.log("insert success");
        }
        connect.end();
    });
}

exports.delete_course_info = function(condition,value){
    var connect = getConnect();
    var table_name = 't_course_info';
    var database_name = 'ojmooc';
    connect.connect();
    connect.query("use " + database_name);
    connect.query('delete from ' + table_name + ' where ' + condition + ' = ?',value,function(err,result){
        if(err){
            console.log(err);
        }
        else {
            console.log("delete success");
        }
        connect.end();
    });
}