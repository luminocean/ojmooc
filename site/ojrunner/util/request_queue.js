/**
 * 请求队列，用于调度请求防止大量请求一起涌向后台
 */

/**
 * 请求队列的构造函数,继承自EventEmitter
 * @param callbacks 调度时回调的函数数组
 * @constructor
 */
var RequestQueue = function(callbacks){
    this.callbacks = callbacks;
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

    var that = this;
    var nextRequest = this.next;

    var obj = this.queue.pop();
    //执行请求，交给回调函数链处理
    this.processCallbackChain(obj.req,obj.res,function(){
        nextRequest.call(that);
    });
};

/**
 * 处理回调函数链，从而支持中间件
 * @param req 请求对象
 * @param res 响应对象
 * @param finish 处理链全部完成，处理下一个请求
 */
RequestQueue.prototype.processCallbackChain = function(req,res,finish){
    var callbacks = this.callbacks;
    var index = 0;
    nextCallback();

    /**
     * 执行下一个回调函数，如果执行完了就执行下一个请求
     * @param chainContinues 如果指定为false表示直接进入下一个请求，不再往下处理中间件了
     */
    function nextCallback(chainContinues){
        if(chainContinues === false){
            finish();
            return;
        }

        if(callbacks[index]){
            callbacks[index++](req,res,nextCallback);
        }else{
            finish();
        }
    }
};

exports.RequestQueue = RequestQueue;

