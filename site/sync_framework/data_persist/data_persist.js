/**
 * Created by blueking on 2015/3/7.
 */
var mysql = require('../node_modules/mysql');

var database_name = 'ojmooc';
var table_name = 't_course_info';

var client = mysql.createConnection({
    user: 'root',
    password: '123456'
});

client.connect();
client.query("use " + database_name);

client.query(
    'SELECT * FROM '+table_name,
    function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }

        if(results)
        {
            for(var i = 0; i < results.length; i++)
            {
                console.log("%d\t%s\t%s", results[i].cid, results[i].cname,results[i].csection);
            }
        }
        client.end();
    }
);