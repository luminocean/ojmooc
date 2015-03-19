/**
 * Created by blueking on 2015/3/7.
 */
var mysql = require('../node_modules/mysql');
getConnect = function(){
    var connect = mysql.createConnection({
        user: 'root',
        password: '123456'
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
                for (var i = 0; i < results.length; i++) {
                    console.log("%d\t%s\t%s", results[i].cid, results[i].cname, results[i].csection);
                }
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
            throw err;
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
            throw err;
        }
        else {
            console.log("delete success");
        }
        connect.end();
    });
}