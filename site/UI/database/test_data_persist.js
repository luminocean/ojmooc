/**
 * Created by blueking on 2015/3/8.
 */
dp = require('./data_persist');
dp.query_course_info('cid',1,function(err,results){
    for (var i = 0; i < results.length; i++) {
        var cid = results[i].cid;
        if(cid == 1) {
            console.log(cid);
        }
        var cname = results[i].cname;
        if(cname == 'software') {
            console.log(cname);
        }
    }
});

dp.insert_course_info({cid:4,cname:'Math'});

dp.delete_course_info('cid',4);
