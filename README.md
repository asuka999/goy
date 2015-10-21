# goy
a toy of js async flow control, inspire by goroutine and co

## example
```javascript
//normal
function streamData() {
    return go(function*(next) {
        req.pause();
        var fileName = 'gen';
        var [exists] = yield fs.exists('tmp', next);
        if (!exists) {
            var [err] = yield fs.mkdir('tmp', next);
            throw err;
        }
        req.resume()
        var file = fs.createWriteStream('./tmp/gen');
        var pipe = req.pipe(file);
        yield req.on('end', next);
        return true;
    }).then(function(rs) {
        console.log(rs);
    }).then(go(function*() {
        console.log("hahahh")
    }));
}

//waitgroup
go(function* test(next) {
    var g = go();
    for (var i = 0; i < 10; i++) {
        g.add(function*(done) {
            var rs = yield setTimeout(done, 1000);
            console.log("hahahhhahha")
        });
    }
    yield g.wait(next);
});

//racegroup
go(function* test(next) {
    var g = go();
    for (var i = 0; i < 10; i++) {
        g.add(function*(done) {
            var rs = yield setTimeout(done, 1000);
            console.log("hahahhhahha")
        });
    }
    yield g.race(next);
})

```