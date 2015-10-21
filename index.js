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


    // function streamData() {
    //     return go(function*(next) {
    //         req.pause();
    //         var fileName = 'gen';
    //         var [exists] = yield fs.exists('tmp', next);
    //         if (!exists) {
    //             var [err] = yield fs.mkdir('tmp', next);
    //             throw err;
    //         }
    //         req.resume()
    //         var file = fs.createWriteStream('./tmp/gen');
    //         var pipe = req.pipe(file);
    //         yield req.on('end', next);
    //         return true;
    //     }).then(function(rs){
    //         console.log(rs);
    //     }).then(go(function*() {
    //         console.log("hahahh")
    //     }));
    // }
