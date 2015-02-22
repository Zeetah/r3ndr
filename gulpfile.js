var gulp        = require('gulp'),
    streamify   = require('gulp-streamify'),
    uglify      = require('gulp-uglify'),
    mocha       = require('gulp-mocha'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream');

gulp.task('bundle', function() {
  var bundle = browserify({
    entries: ['./lib/r3ndr.js'],
    fullPaths: false
  }).bundle();

  bundle
    .pipe(source('r3ndr.js'))
    .pipe(gulp.dest('./dist/'));

  return bundle
    .pipe(source('r3ndr.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('test:node', function() {
  gulp
    .src ('./specs/r3ndr.js')
    .pipe(mocha());
});

gulp.task('test', ['test:node']);