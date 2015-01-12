/**
 * 请求队列，用于调度请求防止大量请求一起涌向后台
 */
var events = require('events');
var util = require('util');

/**
 * 请求队列的构造函数,继承自EventEmitter
 * @param callback 调度时回调的函数
 * @constructor
 */
var RequestQueue = function(callback){
    this.callback = callback;
    this.queue = [];
    this.processing = false;
};

/**
 * 将请求加入队列，如果没有当前没有在处理的请求就执行一个，否则什么也不做
 * @param req
 * @param res
 */
RequestQueue.prototype.push = function(req, res){
    var obj = {};
    obj.req = req;
    obj.res = res;
    this.queue.push(obj);

    if(this.processing) return;

    this.processing = true;
    this.next();
};

/**
 * 执行下一个请求
 */
RequestQueue.prototype.next = function(){
    if(this.queue.length == 0){
        this.processing = false;
        return;
    }

    var obj = this.queue.pop();
    this.callback(obj.req, obj.res);
};


exports.RequestQueue = RequestQueue;

