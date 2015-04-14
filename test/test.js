var assert = require('assert');
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');
var renamer = require('../index');

var basePath = path.join(__dirname, 'fixtures');

function rename(sources, options, callback, errorCallback) {
    var stream = renamer(options);

    var files = [];
    stream.on('data', function (file) {
        files.push(file);
    });
    stream.on('end', function() {
    	callback(files);
    });
    stream.on('error', function(error) {
    	errorCallback && errorCallback(error);
    });
    sources.forEach(function(source) {
        stream.write(source);
    });

    stream.end();
}

function loadStreamFile(filepath) {
    return new gutil.File({
        cwd: __dirname,
        base: basePath,
        path: filepath,
        contents: fs.readFileSync(filepath)
    });
}

function simpleRenameFn(originalPath, parentPath, callback) {
	var renamed;
	if (originalPath[0] === '.') {
		renamed = path.resolve(path.dirname(parentPath), originalPath);
	} else {
		renamed = path.resolve('test/fixtures/deps', originalPath);
	}
	callback(null, renamed);
}

module.exports = {
	testRenamer: function(test) {
		var sources = [loadStreamFile(path.join(basePath, 'src/foo.js'))];
		rename(sources, {basePath: basePath, renameFn: simpleRenameFn}, function(files) {
			assert.strictEqual(1, files.length);
			assert.strictEqual('import core from "deps/dependency1/core";', files[0].contents.toString('utf8'));
			test.done();
		});
	},

	testError: function(test) {
		var threwError = false;
		var expectedError = new Error();
		var errorFn = function() {
			throw expectedError;
		};
		rename(
			[loadStreamFile(path.join(basePath, 'src/foo.js'))],
			{basePath: basePath, renameFn: errorFn},
			function() {
				assert.ok(threwError);
				test.done();
			},
			function(error) {
				assert.strictEqual(expectedError, error);
				threwError = true;
			}
		);
	}
};