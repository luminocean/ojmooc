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
exports.queryInfo = function(tablename,conditon,value) {
    var connect = getConnect();
    var table_name = tablename;
    var database_name = 'ojmooc';
    connect.connect();
    connect.query("use " + database_name);

    connect.query(
        'SELECT * FROM '+table_name + ' where ' + conditon + ' = ?', [value],
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }

            if (results) {
                for (var i = 0; i < results.length; i++) {
                    console.log("%d\t%s\t%s", results[i].cid, results[i].cname, results[i].csection);
                }
            }
            connect.end();
        }
    );
}

exports.insert = function(tablename,values){
    var connect = getConnect();
    var table_name = tablename;
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

exports.delete = function(tablename,condition,value){
    var connect = getConnect();
    var table_name = tablename;
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

course = function (cid) {
    this.cid = cid;
}