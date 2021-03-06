function gor(fn) {
    if (fn === undefined) {
        //private
        var stack = [];
        var nxt;

        //export
        return {
            add: function(gen) {
                var gen = gen(done);

                function done() {
                    gen.next();
                    stack.splice(stack.indexOf(gen), 1);
                    nxt();
                }
                gen.next();
                stack.push(gen);
            },
            wait: function(next) {
                nxt = function() {
                    if (stack.length === 0) {
                        process.nextTick(next);
                    }
                }
            },
            race: function(next) {
                nxt = function() {
                    process.nextTick(next);
                }
            },

        }
    }

    //private
    var next;

    var rs = new Promise(function(resolve, reject) {
        next = function next() {
            var ret = gen.next(arguments)
            if (ret.done) {
                resolve(ret.value)
            }
        }
    });
    var gen = fn(next);
    gen.next();
    return rs;
}

module.exports = gor;

