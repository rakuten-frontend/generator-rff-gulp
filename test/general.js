/* eslint-env mocha */
'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('Generator', function () {
  describe('with default options', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .on('end', done);
    });

    it('creates expected files', function () {
      assert.file([
        'package.json'
      ]);
    });
  });

  describe('without "ready" answer', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({ready: false})
        .on('end', done);
    });

    it('cancels creating files', function () {
      assert.noFile([
        'package.json'
      ]);
    });
  });
});
