gulp-es6-imports-renamer
===================================

Gulp plugin for [es6-imports-renamer](https://github.com/mairatma/es6-imports-renamer)., which renames paths from es6 import declarations.

## Usage

```javascript
var gulp = require('gulp');
var rename = require('gulp-es6-imports-renamer');

gulp.task('rename', function() {
	gulp.src('src/*.js')
		.pipe(rename({renameFn: renameFn}))
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
		.pipe(rename({renameFn: renameFn}))
		.pipe(transpile({formatter: 'bundle'}))
		.pipe(gulp.dest('dist'));
});
```

That way you can build a bundle with all dependencies, including external ones (like jspm packages).

## API

### config

Accepts all config options accepted by [es6-imports-renamer](https://github.com/mairatma/es6-imports-renamer), except `sources`, as that is filled automatically by `gulp-es6-imports-renamer` from the files that are received through the stream.
