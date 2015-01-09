/**
 * 执行请求的的等待队列实现，防止大量请求涌向后台
 */
var events = require('events');
var util = require('util');

/**
 * 等待队列的构造函数
 */
var RequestQueue = function(callback){
    //存放出队列的回调函数
    this.callback = callback;
    //内部的等待队列
    this.queue = [];
    //是否处在处理状态的flag
    this.processing = false;
    events.EventEmitter.call(this);
};
//继承自EventEmitter
util.inherits(RequestQueue, events.EventEmitter);

//导出构造方法
exports.RequestQueue = RequestQueue;

/**
 * 队列的push方法
 * @param srcCode 要编译的源码
 * @param srcType 源码类型
 * @param inputData 输入的数据
 * @param callback
 */
RequestQueue.prototype.push = function(srcCode,inputData,srcType,callback){
    var request = {};
    request.srcCode = srcCode;
    request.srcType = srcType;
    request.inputData = inputData;
    request.callback = callback;
    this.queue.push(request);
    //触发push事件
    this.emit('push', request);
};

/**
 * 请求被处理完时由外部调用，从而可以派发下一个请求
 */
RequestQueue.prototype.finish = function(){
    this.emit('finish');
};

/**
 * push事件处理
 */
RequestQueue.prototype.on('push', function(){
    //有正在处理的请求则跳过
    if(this.processing) return;
    //否则分派下一个请求
    this.processing = true;
    this.next();
});

/**
 * finish事件处理
 */
RequestQueue.prototype.on('finish', function(){
    //如果都处理完了则停止
    if(this.queue.length == 0)
        this.processing = false;
    else
        this.next();
});

/**
 * 回调下一个请求
 */
RequestQueue.prototype.next = function(){
    if(this.queue.length>0){
        var request = this.queue.pop();
        this.callback(request.srcCode, request.inputData, request.srcType, request.callback);
    }
};









