# TasksQ

## 定义预处理方法
```javascript
module.exports = (task) => (() => {
    let obj = task.obj;
    task.progress(current, total)
    task.done(error, result)
    task.on('prestart', (e) => {
       //预处理监听
    })
    task.on('success', (e) => {
       //执行成功监听
    })
    task.on('failed', (e) => {
       //处理失败监听
    })
    task.on('progress', (e) => {
       //处理中监听
    })
})
```

## 注册队列任务方法
```javascript
const { init, queue, task } = require('tasksq')
const func1 = require('./regfunc1') //预处理方法
var q = init(); //queue初始化
/**
 * 注册方法
 * @param {Object} obj 
 *  @param {Function} func 基础方法
 *  @param {Number} parallel 并行执行数量
 *  @param {Function} name target 名字 
 * 
 */
q.reg({
    func: func1,
    parallel: 10,
    name: 'test1'
})
/**
 * @param {String} targetname 目标名
 */
q.unreg()
/**
 * @param {Task} task 添加task
 */
q.addtask(task)
```

## 添加队列任务
```javascript
//timeout 延时执行
//retry   重试次数
    let t = new task({
        target: 'test1',//目标方法名
        obj: { 
            id: 23
        } //传参
    });
    q.addtask(t)
```