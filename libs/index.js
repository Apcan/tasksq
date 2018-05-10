const queue = require('./queue');
const task = require('./task');

var q = null;

function init() {
    q = new queue();
    global.q = q;
    return q;
}


module.exports = {
    init, queue, task
}