var dbr = require('./core/debugger');

dbr.suit('hello',[17,19],function(err,result){
    if(err){
       console.error(err.stack);
       console.error(err.message);
       return;
    }

    console.log(result);
});