'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rp = require('request-promise');
var path = require('path');

var abort = false;

module.exports = generators.Base.extend({
  prompting: function () {
    var dirname = path.basename(this.env.cwd);
    this.log(yosay('Welcome to ' + chalk.red('rff-gulp') + ' generator!'));
    var prompts = [{
      type: 'confirm',
      name: 'ready',
      message: 'Would you like to create a new project in "' + dirname + '" directory?',
      default: true
    }];
    return this.prompt(prompts)
      .then(function (props) {
        abort = !props.ready;
      });
  },

  writing: function () {
    if (abort) {
      this.log('Process canceled.');
      return;
    }
    var self = this;
    var user = 'rakuten-frontend';
    var repo = 'rff-gulp';
    var jsonUrl = 'https://github.com/' + user + '/' + repo + '/raw/master/package.json';
    return rp(jsonUrl)
      .then(function (json) {
        return JSON.parse(json);
      })
      .then(function (pkg) {
        var remoteUrl = 'https://github.com/' + user + '/' + repo + '/releases/download/v' + pkg.version + '/' + repo + '-v' + pkg.version + '.zip';
        return new Promise(function (resolve, reject) {
          self.remote(remoteUrl, function (err, remote) {
            if (err) {
              reject(err);
              return;
            }
            resolve(remote);
          }, true);
        });
      })
      .then(function (remote) {
        remote.directory('.', '.');
      })
      .catch(function (err) {
        abort = true;
        self.log(chalk.red('Failed to fetch template!'));
        self.log(chalk.gray(err.toString()));
      });
  },

  install: function () {
    if (abort) {
      return;
    }
    this.installDependencies({bower: false});
  }
});
