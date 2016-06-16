'use strict';

const generators = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const rp = require('request-promise');
const path = require('path');

let abort = false;

class Generator extends generators.Base {
  prompting() {
    const dirname = path.basename(this.env.cwd);
    this.log(yosay(`Welcome to ${chalk.red('rff-gulp')} generator!`));
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
      this.log('Process canceled.');
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
          this.remote(remoteUrl, (err, remote) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(remote);
          }, true);
        });
      })
      .then(remote => {
        remote.directory('.', '.');
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
    this.installDependencies({bower: false});
  }
}

module.exports = Generator;
