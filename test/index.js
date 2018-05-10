const { init, queue, task } = require('../libs')
const func1 = require('./regfunc1')
var q = init();

q.reg({
    func: func1,
    parallel: 10,
    name: 'test1'
})

for (let i = 0; i < 1; i++) {
    let t = new task({
        target: 'test1',
        obj: {
            id: i
        }
    });
    q.addtask(t)
}

setTimeout(() => {
    let t = new task({
        target: 'test1',
        obj: {
            id: 23
        }
    });
    q.addtask(t)
}, 20 * 1000);