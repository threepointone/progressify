// for a function that accepts a callback as its last paramater, 
// this function makes it so that a progress bar appears (and then disappears) whenever that function is called


"use strict";

var slice = [].slice;

function progressify(fn, scope, timeout) {
    return function() {
        var bar = require('progress')();
        bar.inc();
        var intval = setInterval(function() {
            if (bar.finished) {
                clearInterval(intval);
            } else {
                bar.inc();
            }
        }, 1000);

        setTimeout(function(){  // an actual timeout. 30 seconds. 
            bar.end();
        }, timeout || 30000)

        var args = slice.call(arguments, 0);
        var done = args[args.length - 1];

        if (typeof done !== 'function') {            
            args = args.concat([function() {
                bar.end();
            }]);
        } else {
            // couch the function to add our call to end the progress bar
            args[args.length - 1] = function() {
                bar.end();
                done.apply(null, arguments);
            };
        }
        return fn.apply(scope, args);
    };
}

module.exports = progressify;