/* eslint-env mocha */
'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;
var nock = require('nock');

describe('Error', function () {
  describe('in fetching package.json', function () {
    before(function (done) {
      nock('https://github.com')
        .persist()
        .get('/rakuten-frontend/rff-gulp/raw/master/package.json')
        .reply(404)
        .get('/rakuten-frontend/rff-gulp/releases/download/v0.0.0/rff-gulp-v0.0.0.zip')
        .replyWithFile(200, path.join(__dirname, '../fixtures/rff-gulp-v0.0.0.zip'));
      helpers.run(path.join(__dirname, '../../generators/app'))
        .on('end', done);
    });

    after(function () {
      nock.cleanAll();
    });

    it('cancels creating files', function () {
      assert.noFile([
        'package.json'
      ]);
    });
  });

  describe('in fetching remote template', function () {
    before(function (done) {
      nock('https://github.com')
        .persist()
        .get('/rakuten-frontend/rff-gulp/raw/master/package.json')
        .replyWithFile(200, path.join(__dirname, '../fixtures/package.json'))
        .get('/rakuten-frontend/rff-gulp/releases/download/v0.0.0/rff-gulp-v0.0.0.zip')
        .reply(404);
      helpers.run(path.join(__dirname, '../../generators/app'))
        .on('end', done);
    });

    after(function () {
      nock.cleanAll();
    });

    it('cancels creating files', function () {
      assert.noFile([
        'package.json'
      ]);
    });
  });
});
