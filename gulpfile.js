'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');

gulp.task('static', function () {
  return gulp.src([
    '*.js',
    'generators/app/*.js',
    'test/specs/*.js'
  ])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
  $.nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-test', function () {
  return gulp.src('generators/**/*.js')
    .pipe($.istanbul({
      includeUntested: true
    }))
    .pipe($.istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;

  gulp.src('test/specs/*.js')
    .pipe($.plumber())
    .pipe($.mocha({
      reporter: 'spec',
      timeout: 10000
    }))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe($.istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('coveralls', ['test'], function () {
  if (!process.env.CI) {
    return;
  }
  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe($.coveralls());
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', ['static', 'test', 'coveralls']);
