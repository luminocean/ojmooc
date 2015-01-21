var dbr = require('./app');

dbr.debug('hello',9,function(err,result){
    if(err){
       console.error(err.stack);
       console.error(err.message);
       return;
    }

    console.log(result);
});