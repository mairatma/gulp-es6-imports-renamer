var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var gutil = require('gulp-util');
var recast = require('recast');
var renamer = require('es6-imports-renamer');
var sourceMap  = require('vinyl-sourcemaps-apply');
var through = require('through2');

function Renamer(options) {
    options = options || {};
    options.sources = [];

    function flush(callback) {
        var stream = this;
        renamer(options, function(error, results) {
            results.forEach(function(result) {
                var rendered = recast.print(result.ast, {
                    sourceMapName: result.path
                });
                var file = new gutil.File({
                    contents: new Buffer(rendered.code),
                    path: result.path
                });
                sourceMap(file, rendered.map);
                stream.push(file);
            });

            callback();
        });
    }

    function jsEval(content) {
        return eval(content);
    }

    function rename(file, encoding, callback) {
    	tryCatch(renameInternal, this, [file, encoding, callback]);
    }

    function renameInternal(file, encoding, callback) {
        options.sources.push({
            ast: recast.parse(file.contents.toString(encoding)),
            path: file.path
        });
        callback();
    }

    function tryCatch(fn, ctx, args) {
        try {
            return fn.apply(ctx, args);
        }
        catch(error) {
            ctx.emit('error', new gutil.PluginError({
                plugin: 'gulp-es6-imports-renamer',
                message: 'File: ' + args[0].sourceMap.file + '\n' + error
            }));
        }
    }

    return through.obj(rename, flush);
}

Renamer.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = Renamer;