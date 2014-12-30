var moment = require('moment');

exports.generateFileName = function(){
    var timestamp = moment().format('YYYYMMDDx');
    return timestamp;
};