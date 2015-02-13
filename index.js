var gutil = require('gulp-util');
var fs = require('fs');
var recast = require('recast');
var renamer = require('es6-imports-renamer');
var sourceMap  = require('vinyl-sourcemaps-apply');
var through = require('through2');

module.exports = function(options) {
	options = options || {};
	var basePath = options.basePath;
	var configPath = options.configPath;
	var sources = [];

	function rename(file, encoding, callback) {
		sources.push({
			ast: recast.parse(file.contents.toString(encoding)),
			path: file.path
		});
		callback();
	};

	function flush(callback) {
		if (configPath) {
			var script = fs.readFileSync(configPath, 'utf8');
			eval(script);
		}

		var stream = this;
		renamer({sources: sources, basePath: basePath}, function(results) {
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
	return through.obj(rename, flush);
};