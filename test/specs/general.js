/* eslint-env mocha */
'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var nock = require('nock');

describe('Generator', function () {
  before(function () {
    nock('https://github.com')
      .persist()
      .get('/rakuten-frontend/rff-gulp/raw/master/package.json')
      .replyWithFile(200, path.join(__dirname, '../fixtures/package.json'))
      .get('/rakuten-frontend/rff-gulp/releases/download/v0.0.0/rff-gulp-v0.0.0.zip')
      .replyWithFile(200, path.join(__dirname, '../fixtures/rff-gulp-v0.0.0.zip'));
  });

  after(function () {
    nock.cleanAll();
  });

  describe('with default options', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../../generators/app'))
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
      helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({ready: false})
        .on('end', done);
    });

    it('doesn\'t create files', function () {
      assert.noFile([
        'package.json'
      ]);
    });
  });
});
