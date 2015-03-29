var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ojmooc',
    database:'ojmooc',
    port: 3306
});


//如果断开，2秒后重连
function connect(){
    conn.connect((function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(connect, 2000);
        }
    }));
}

conn.on('error', function (err) {
    console.log('db error', err);
    // 如果是连接断开，自动重新连接
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        connect();
    } else {
        throw err;
    }
});

connect();

module.exports=conn;

//var insertSQL = 'insert into t_user(name) values("conan"),("fens.me")';
//var selectSQL = 'select * from t_user limit 10';
//var deleteSQL = 'delete from t_user';
//var updateSQL = 'update t_user set name="conan update"  where name="conan"';

////delete
//conn.query(deleteSQL, function (err0, res0) {
//  if (err0) console.log(err0);
//  console.log("DELETE Return ==> ");
//  console.log(res0);
//
//  //insert
//  conn.query(insertSQL, function (err1, res1) {
//    if (err1) console.log(err1);
//    console.log("INSERT Return ==> ");
//    console.log(res1);
//
//    //query
//    conn.query(selectSQL, function (err2, rows) {
//      if (err2) console.log(err2);
//
//      console.log("SELECT ==> ");
//      for (var i in rows) {
//        console.log(rows[i]);
//      }
//
//      //update
//      conn.query(updateSQL, function (err3, res3) {
//        if (err3) console.log(err3);
//        console.log("UPDATE Return ==> ");
//        console.log(res3);
//
//        //query
//        conn.query(selectSQL, function (err4, rows2) {
//          if (err4) console.log(err4);
//
//          console.log("SELECT ==> ");
//          for (var i in rows2) {
//            console.log(rows2[i]);
//          }
//        });
//      });
//    });
//  });
//});


//conn.end();