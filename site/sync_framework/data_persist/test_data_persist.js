/**
 * Created by blueking on 2015/3/8.
 */
dp = require('./data_persist');

dp.queryInfo('t_course_info','tid',1);

dp.insert('t_teacher',{tid:3,tname:'Bob'});

dp.delete('t_teacher','tid',4);