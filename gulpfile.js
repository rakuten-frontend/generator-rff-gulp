'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const path = require('path');

gulp.task('static', () => {
  return gulp.src([
    '*.js',
    'generators/app/*.js',
    'test/specs/*.js'
  ])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('nsp', done => {
  $.nsp({package: path.resolve('package.json')}, done);
});

gulp.task('pre-test', () => {
  return gulp.src('generators/**/*.js')
    .pipe($.istanbul({
      includeUntested: true
    }))
    .pipe($.istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], () => {
  return gulp.src('test/specs/*.js')
    .pipe($.mocha({
      reporter: 'spec',
      timeout: 10000
    }))
    .pipe($.istanbul.writeReports());
});

gulp.task('coveralls', ['test'], () => {
  if (!process.env.CI) {
    return;
  }
  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe($.coveralls());
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', ['static', 'test', 'coveralls']);
