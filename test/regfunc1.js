module.exports = (task) => (() => {
    let obj = task.obj;
    let count = 10;
    let c = 0;
    let prog = setInterval(() => {
        if (c >= count) {
            clearInterval(prog)
            console.log(obj.id, 'done')
            task.done(null, c)
        } else {
            task.progress(c, count)
            c++;
        }
    }, 500)

    task.on('prestart', (e) => {
        console.log('task prestart', t.obj.id)
    })
    task.on('success', (e) => {
        console.log('task success', e)

    })
    task.on('failed', (e) => {
        console.log('task failed', e)

    })
    task.on('progress', (e) => {
        console.log('task progress', e)

    })
})
