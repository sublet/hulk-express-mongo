#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { runner } = require('hygen')
const Logger = require('./logger')

// function success(text) {
//   console.log(text);
//   process.exit(0);
// }

function getTemplatesDirectory() {
  return path.join(__dirname, '../_templates')
}

program
  .version('0.1.0')
  // .command('init', 'initialize current directory with default layout')
  // .requiredOption('-s, --scope <scope>', 'Set scope to private or public.')
  // .requiredOption('-e, --env <env>', 'Set environment.');

program
  .command('init')
  .description('initalize directory with default app layout')
  .action(async () => {
    runner('init new', {
      templates: getTemplatesDirectory(),
      cwd: process.cwd(),
      logger: new Logger(console.log.bind(console)),
      debug: !!process.env.DEBUG,
      exec: (action, body) => {
        const opts = body && body.length > 0 ? { input: body } : {}
        return require('execa').command(action, { ...opts, shell: true })
      },
      createPrompter: () => require('enquirer'),
    }).then(({ success }) => process.exit(success ? 0 : 1))
  });

program
  .command('template:api')
  .description('Create a new API')
  .requiredOption('-t, --title <title>', 'Set name of new API.')
  .action(async (options) => {
    runner(`api new --name ${options.title}`, {
      templates: getTemplatesDirectory(),
      cwd: process.cwd(),
      logger: new Logger(console.log.bind(console)),
      debug: true,
      exec: (action, body) => {
        const opts = body && body.length > 0 ? { input: body } : {}
        return require('execa').command(action, { ...opts, shell: true })
      },
      createPrompter: () => require('enquirer'),
    }).then(({ success }) => process.exit(success ? 0 : 1))
  });

program
  .command('template:service')
  .description('Create a new API')
  .requiredOption('-t, --title <title>', 'Set name of new API.')
  .action(async (options) => {
    runner(`service new --name ${options.title}`, {
      templates: getTemplatesDirectory(),
      cwd: process.cwd(),
      logger: new Logger(console.log.bind(console)),
      debug: true,
      exec: (action, body) => {
        const opts = body && body.length > 0 ? { input: body } : {}
        return require('execa').command(action, { ...opts, shell: true })
      },
      createPrompter: () => require('enquirer'),
    }).then(({ success }) => process.exit(success ? 0 : 1))
  });

program.parse(process.argv);
