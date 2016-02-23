'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var rp = require('request-promise');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the rad ' + chalk.red('generator-rff-gulp') + ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: function () {
    var self = this;
    var done = this.async();
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
        done();
      })
      .catch(function (err) {
        console.error(chalk.red('Failed to fetch template!'));
        done(err);
      });
  },

  install: function () {
    this.installDependencies({bower: false});
  }
});
