var logic = require('./logic');

var controller = {};
module.exports = controller;

controller.process = function(body, callback){
    for(var key in logic){
        if(!logic.hasOwnProperty(key))
            continue;

        if(body[key]){
            logic[key](body[key],function(err,result){
                return callback(err,result);
            });
        }
    }
};

