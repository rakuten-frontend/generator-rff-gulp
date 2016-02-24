/* eslint-env mocha */
'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('generator-rff-gulp:app', function () {
  this.timeout(10000);

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'package.json'
    ]);
  });
});
