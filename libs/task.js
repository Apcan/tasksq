const EventEmitter = require('events');
const utils = require('./utils')
const uuid = require('uuid')
class task extends EventEmitter {

    TSTATUS() {
        return {
            WAITTING: '0',
            PRESTART: '1',
            RUNNING: '2',
            FAILED: '-1',
            SUCCESS: '3'
        }
    }


    constructor(opt) {
        super();
        let { target, timeout, obj, retry } = opt;
        this.target = target;
        this.timeout = timeout || 0;
        this.obj = obj || {};
        this.retry = retry || 0;
        this.current = 0;
        this.status = this.TSTATUS().WAITTING;
        this.id = uuid.v4();
        this.bind();
    }

    prestart(targetfunc) {
        this.function = targetfunc(this);
        this.emit('prestart')
    }

    start() {
        this.function(this)
    }

    getid() {
        return this.id;
    }

    /**
     * 任务进度更新
     * @param {Number} c 当前进度
     * @param {Number} t 总量
     */
    progress(c, t) {
        this.emit('progress', { current: c, total: t });
    }

    /**
     * 任务结束
     * @param {*} err 错误信息
     * @param {*} result 任务结果
     */
    done(err, result) {
        if (err) this.emit('failed', err);
        else this.emit('success', result);
    }

    bind() {
        this.on('prestart', () => {
            this.status = this.TSTATUS().PRESTART;
        })
        this.on('success', () => {
            this.status = this.TSTATUS().SUCCESS;
        })
        this.on('failed', () => {
            this.status = this.TSTATUS().FAILED;
        })
        this.on('progress', () => {
            this.status = this.TSTATUS().RUNNING;
        })
    }
}

module.exports = task;
