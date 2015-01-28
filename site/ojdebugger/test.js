var dbr = require('./core/debugger');

dbr.suit('hello',[17,19],function(err,result){
    if(err){
       console.error(err.stack);
       console.error(err.message);
       return;
    }
    console.log(result);

    var debugId = result.debugId;

    dbr.printVal(debugId,'sum',function(err,result){
        console.log(result);

        dbr.continue(debugId,function(err,result){
            console.log(result);

            dbr.printVal(debugId,'sum',function(err,result) {
                console.log(result);
            });
        });
    });
});