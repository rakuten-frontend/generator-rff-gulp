'use strict';

const Generator = require('yeoman-generator');
const remote = require('yeoman-remote');
const chalk = require('chalk');
const yosay = require('yosay');
const rp = require('request-promise');
const path = require('path');
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');
const notifier = updateNotifier({pkg});

let abort = false;

module.exports = class extends Generator {
  prompting() {
    const dirname = path.basename(this.env.cwd);
    this.log(yosay(`Welcome to ${chalk.red('rff-gulp')} generator!`));
    notifier.notify({
      defer: false,
      boxenOpts: {
        padding: {
          top: 0,
          right: 5,
          bottom: 0,
          left: 5
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 1,
          left: 0
        },
        align: 'center',
        borderColor: 'yellow',
        borderStyle: 'round'
      }
    });
    const prompts = [{
      type: 'confirm',
      name: 'ready',
      message: `Would you like to create a new project in "${dirname}" directory?`,
      default: true
    }];
    return this.prompt(prompts)
      .then(answers => {
        abort = !answers.ready;
      });
  }

  writing() {
    if (abort) {
      this.log(chalk.gray('Process canceled'));
      return;
    }
    const user = 'rakuten-frontend';
    const repo = 'rff-gulp';
    const jsonUrl = `https://github.com/${user}/${repo}/raw/master/package.json`;
    return rp(jsonUrl)
      .then(json => JSON.parse(json))
      .then(pkg => {
        const remoteUrl = `https://github.com/${user}/${repo}/releases/download/v${pkg.version}/${repo}-v${pkg.version}.zip`;
        return new Promise((resolve, reject) => {
          remote(remoteUrl, (err, cachePath) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(cachePath);
          }, true);
        });
      })
      .then(cachePath => {
        this.fs.copy(cachePath, this.destinationPath());
      })
      .catch(err => {
        abort = true;
        this.log(chalk.red('Failed to fetch template!'));
        this.log(chalk.gray(err.toString()));
      });
  }

  install() {
    if (abort) {
      return;
    }
    this.npmInstall();
  }
};
