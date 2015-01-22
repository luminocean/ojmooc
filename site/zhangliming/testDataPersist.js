/**
 * Created by blueking on 2015/1/22.
 */
dp = require("./datapersist");
var result1,result2;
result1 = dp.insertData('people',{_id:'4',name:'zhangyu',age:20});
console.log("-----test insert-----");
console.log(result1);

result2 = dp.findData('people',{'name':'zhangyu'});
console.log("-----test find-----");
console.log(result2);