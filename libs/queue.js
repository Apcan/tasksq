const EventEmitter = require('events');
const Task = require('./task')
class queue extends EventEmitter {
    constructor(tasks, parallel) {
        super();
        this.pcount = parallel || 1;
        this.targets = {};
    }

    /**
     * 注册方法
     * @param {Object} obj 
     *  @param {Function} func 基础方法
     *  @param {Number} parallel 并行执行数量
     *  @param {Function} name target 名字 
     * 
     */
    reg(obj = {}) {
        let { func, name, parallel = 1, cycle } = obj;
        let datas = [];
        let currentrun = 0;
        let tasks = [];
        this.targets[name] = { func, parallel, name, tasks, currentrun, cycle };
    }

    /**
     * 
     * @param {String} targetname 目标名
     */
    unreg(targetname) {
        delete this.targets[targetname];
    }

    /**
     * 
     * @param {Task} task 添加task
     */
    addtask(task) {

        if (!task instanceof Task)
            throw new Error("only task can be add")
        let target = task.target;
        this.targets[target].tasks.push(task);

        this.starttargets();
    }


    starttargets() {
        if (this.isrun) return;
        this.isrun = true;
        for (let t in this.targets) {
            let target = this.targets[t];
            let { func, parallel, name, tasks, currentrun, cycle } = target;

            for (let i = currentrun; i < parallel; i++) {
                if (tasks.length === 0) break;
                let task = tasks.shift();
                task.prestart(func);
                task.start();
                task.on('success', (result) => {
                    target.currentrun--;
                    this.starttargets();
                    this.emit('taskdone', task, result)
                })
                task.on('failed', (err) => {
                    task.current++;
                    addtask(task)
                    this.starttargets();
                    this.emit('taskerror', task, err)
                })
                target.currentrun++;
            }
        }
        this.isrun = false;
        this.checkbusy();
    }


    checkbusy() {
        if (!this.isstart) return;
        let isbusy = true;
        for (let t in this.targets) {
            let target = this.targets[t];
            let { parallel, currentrun } = target;
            if (currentrun < parallel) {
                isbusy = false;
            }
        }
        if (!isbusy) this.starttargets();
    }

    /**
     * 
     * @param {String} targetname 
     */
    clearall(targetname) {
        if (targetname) this.targets[targetname].tasks = [];
        else
            for (let t in this.targets) {
                this.targets[t].tasks = [];
            }
    }

    resume() {
        this.isstart = true;
        this.starttargets();
    }

    pause() {
        this.isstart = false;
    }
    taskdone(callback) {
        this.on('finish', (target, result) => {

        })
    }
}

module.exports = queue