/**
 * 请求队列，用于调度请求防止大量请求一起涌向后台
 * 基本执行流程说明如下：
 * 1、使用方调用push将请求和响应对象压入请求队列
 * 2、请求队列依据FIFO逐个分发请求，将请求和响应对象传给（构造函数中）注册的回调函数处理
 * 3、回调函数并非只有一个，而是一个数组，每个回调函数接收的参数为请求对象、响应对象以及next函数
 * 4、当一个回调函数处理完后调用next则会处理下一个回调函数
 * 5、如果请求队列中注册的回调函数都处理完或者某一个回调函数给next传了一个false则表示完成了回调函数数组的处理
 * 请求队列接着分发下一个请求
 * 6、重复2-5
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
 * 如果还有没处理的请求就执行下一个请求
 */
RequestQueue.prototype.next = function(){
    //如果已经全部处理完就把处理flag置为false然后直接返回
    if(this.queue.length == 0){
        this.processing = false;
        return;
    }

    //否则处理下一个请求，把请求交给回调数组处理
    var that = this;
    var nextRequest = this.next;
    var obj = this.queue.pop();
    this.processCallbackChain(obj.req,obj.res,function(){
        //当中间件处理完毕时调用，将会递归处理下一个请求
        nextRequest.call(that);
    });
};

/**
 * 处理回调函数链，从而支持中间件结构
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
            //到这里说明所有配置的中间件都处理完了，那么就处理下一个请求
            finish();
        }
    }
};

exports.RequestQueue = RequestQueue;

