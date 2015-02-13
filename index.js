var recast = require('recast');
var renamer = require('es6-imports-renamer');
var sourceMap  = require('vinyl-sourcemaps-apply');
var through = require('through2');

module.exports = function(options) {
	options = options || {};
	var basePath = options.basePath;
	var sources = [];

	function rename(file, encoding, callback) {
		sources.push(recast.parse(file.contents.toString(encoding)));
	};

	function flush(callback) {
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