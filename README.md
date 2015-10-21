# goy
a toy of js async flow control, inspire by goroutine and co

## Specification
- you must running node 0.12.0 or higher for generator support with the --harmony_generators or --harmony flag.
- to use the params feature,  you must running node 0.12.0 or higher for des support --harmony_destructuring.
- you can't pass the next in the same `tick`, cause generator can't call the next in the generator itself.


## Example
```javascript
//normal
function streamData(stream) {
    return go(function*(next) {
        stream.pause();
        var fileName = 'gen';
        var [exists] = yield fs.exists('tmp', next);
        if (!exists) {
            var [err] = yield fs.mkdir('tmp', next);
            throw err;
        }
        stream.resume()
        var file = fs.createWriteStream('./tmp/gen');
        var pipe = stream.pipe(file);
        yield stream.on('end', next);
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
    console.log("end")
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
    console.log("end")
})

```


## API
#### go 
expect a `generator` as parameter which gets one argument (next) and the `go` function return a generator
or no parameter and return a object of *asyncgroup*

##### add 
expect a `generator` like `go` 

##### race 
expect a function as parameter which you gets in go'parameter, more see example
will call next when the asyncgroup's function first finish

##### wait 
like race
will call next when the asyncgroup's function first finish
