var assert = require('assert');
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');
var System = require('es6-imports-renamer/node_modules/systemjs');
var renamer = require('../index');

function rename(options, callback) {
    var stream = renamer(options);

    var files = [];
    stream.on('data', function (file) {
        files.push(file);
    });
    stream.on('end', function() {
    	callback(files);
    });
    options.sources.forEach(function(source) {
        stream.write(source);
    });

    stream.end();
}

function loadStreamFile(filepath) {
    return new gutil.File({
        cwd: __dirname,
        base: path.join(__dirname, 'fixtures'),
        path: filepath,
        contents: fs.readFileSync(filepath)
    });
}

module.exports = {
	testRenamer: function(test) {
		var basePath = path.join(__dirname, 'fixtures');
		System.baseURL = basePath;
		System.config({
			paths: {
				'*': '*.js',
				'deps:*': 'deps/*.js'
			},
			map: {
				'dependency1': 'deps:dependency1'
			}
		});

		var sources = [loadStreamFile(path.join(basePath, 'src/foo.js'))];
		var remaining = 2;
		rename({sources: sources, basePath: basePath}, function(files) {
			assert.strictEqual(2, files.length);
			assert.strictEqual('import core from "deps/dependency1/core";', files[0].contents.toString('utf8'));
			test.done();
		});
	}
};