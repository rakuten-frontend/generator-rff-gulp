/* eslint-env mocha */
'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const nock = require('nock');

describe('Error', () => {
  describe('in fetching package.json', () => {
    before(done => {
      nock('https://github.com')
        .persist()
        .get('/rakuten-frontend/rff-gulp/raw/master/package.json')
        .reply(404)
        .get('/rakuten-frontend/rff-gulp/releases/download/v0.0.0/rff-gulp-v0.0.0.zip')
        .replyWithFile(200, path.join(__dirname, '../fixtures/rff-gulp-v0.0.0.zip'));
      helpers.run(path.join(__dirname, '../../generators/app'))
        .on('end', done);
    });

    after(() => {
      nock.cleanAll();
    });

    it('cancels creating files', () => {
      assert.noFile([
        'package.json'
      ]);
    });
  });

  describe('in fetching remote template', () => {
    before(done => {
      nock('https://github.com')
        .persist()
        .get('/rakuten-frontend/rff-gulp/raw/master/package.json')
        .replyWithFile(200, path.join(__dirname, '../fixtures/package.json'))
        .get('/rakuten-frontend/rff-gulp/releases/download/v0.0.0/rff-gulp-v0.0.0.zip')
        .reply(404);
      helpers.run(path.join(__dirname, '../../generators/app'))
        .on('end', done);
    });

    after(() => {
      nock.cleanAll();
    });

    it('cancels creating files', () => {
      assert.noFile([
        'package.json'
      ]);
    });
  });
});
