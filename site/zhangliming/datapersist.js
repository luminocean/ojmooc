/**
 * Created by blueking on 2015/1/22.
 */
var mongodb = require('mongodb');

var mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize: 10 });
var db = new mongodb.Db('ojmooc', mongodbServer,{safe:true});

exports.insertData = function(tableName,data){
    db.close();
    db.open(function(err,db) {
        if (!err) {
            console.log('connect to database');
            //create a collection,like the table in sql
            db.collection(tableName, function (err, collection) {
                if (err) {
                    console.log(err);
                }
                else {
                    //insert data to table test_table
                    //var tmp = [{_id: '1', name: 'zhangliming', age: 20}, {_id: '2', name: 'zhangxin', age: 12}];
                    collection.insert(data, {safe: true}, function (err, result) {
                        console.log("--------insert----------");
                        console.log(result);
                        return result;
                    });
                }
            });
        }
    });
}

exports.findData = function(tableName,choice){
    db.close();
    db.open(function(err,db) {
        if (!err) {
            console.log('connect to database');
            //create a collection,like the table in sql
            db.collection(tableName, function (err, collection) {
                if (err) {
                    console.log(err);
                }
                else {
                    collection.find(choice).toArray(function(err,result){
                        console.log("---------find---------");
                        console.log(result);
                        return result;
                    });
                }
            });
        }
    });
}
