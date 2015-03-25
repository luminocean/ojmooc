var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ojmooc',
    database:'test2',
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