/* eslint-env mocha */
'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const nock = require('nock');

describe('Generator', () => {
  before(() => {
    nock('https://github.com')
      .persist()
      .get('/rakuten-frontend/rff-gulp/raw/master/package.json')
      .replyWithFile(200, path.join(__dirname, '../fixtures/package.json'))
      .get('/rakuten-frontend/rff-gulp/releases/download/v0.0.0/rff-gulp-v0.0.0.zip')
      .replyWithFile(200, path.join(__dirname, '../fixtures/rff-gulp-v0.0.0.zip'));
  });

  after(() => {
    nock.cleanAll();
  });

  describe('with default options', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../../generators/app'))
        .on('end', done);
    });

    it('creates expected files', () => {
      assert.file([
        'package.json'
      ]);
    });
  });

  describe('without "ready" answer', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../../generators/app'))
        .withPrompts({ready: false})
        .on('end', done);
    });

    it('doesn\'t create files', () => {
      assert.noFile([
        'package.json'
      ]);
    });
  });
});
