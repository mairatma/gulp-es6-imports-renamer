gulp-es6-imports-renamer
===================================

Gulp plugin for [es6-imports-renamer](https://github.com/mairatma/es6-imports-renamer)., which renames paths from es6 import declarations.

## Usage

```javascript
var gulp = require('gulp');
var rename = require('gulp-es6-imports-renamer');

gulp.task('rename', function() {
	gulp.src('src/*.js')
		.pipe(rename({configPath: 'config.js'}))
		.pipe(gulp.dest('dist'));
});
```

Renaming dependencies with gulp can be very useful right before running a module transpiler:

```javascript
var gulp = require('gulp');
var rename = require('gulp-es6-imports-renamer');
var transpile = require('gulp-es6-module-transpiler');

gulp.task('rename', function() {
	gulp.src('src/*.js')
		.pipe(rename({configPath: 'config.js'}))
		.pipe(transpile({formatter: 'bundle'}))
		.pipe(gulp.dest('dist'));
});
```

That way you can build a bundle with all dependencies, including external ones (like jspm packages).

## API

### config

- `basePath` **{?string}** Optional base path. If given, import sources will be renamed relative to it. Otherwise they will be renamed to absolute paths.
- `configPath` **(?string)** Optional configuration file path. If given, the file with
the configuration will be loaded before the renamer is run.
