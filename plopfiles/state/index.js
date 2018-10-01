const fs = require('fs-extra');
// const glob = require('glob');

const BASE_DIR = 'modules';

module.exports = function(plop) {
  plop.setActionType('state', (answer, config, plop) => {
    const { featureName } = answer;

    let filename;
    let template;
    const dirname = `${BASE_DIR}/${featureName}/state`;
    if (fs.existsSync(dirname)) {
      return `state ${featureName} exists`;
    }

    ['effects', 'reducers', 'subscriptions'].forEach(staff => {
      // internals
      filename = `${dirname}/${staff}/internals/index.js`;
      template = `${__dirname}/templates/empty.js.hbs`;
      template = fs.readFileSync(template, 'utf-8');
      fs.outputFileSync(filename, plop.renderString(template), 'utf-8');

      // index
      filename = `${dirname}/${staff}/index.js`;
      template = `${__dirname}/templates/internals.js.hbs`;
      template = fs.readFileSync(template, 'utf-8');
      fs.outputFileSync(filename, plop.renderString(template), 'utf-8');
    });

    filename = `${dirname}/namespace.js`;
    template = `${__dirname}/templates/namespace.js.hbs`;
    template = fs.readFileSync(template, 'utf-8');
    fs.outputFileSync(filename, plop.renderString(template, { featureName }), 'utf-8');

    filename = `${dirname}/initial-state.js`;
    template = `${__dirname}/templates/empty.js.hbs`;
    template = fs.readFileSync(template, 'utf-8');
    fs.outputFileSync(filename, plop.renderString(template), 'utf-8');

    filename = `${dirname}/index.js`;
    template = `${__dirname}/templates/index.js.hbs`;
    template = fs.readFileSync(template, 'utf-8');
    fs.outputFileSync(filename, plop.renderString(template), 'utf-8');

    return `state ${featureName} has created`;
  });

  plop.setGenerator('state', {
    prompts: [
      {
        type: 'input',
        name: 'featureName',
        message: 'State Name?',
        validate(value) {
          if (/.+/.test(value)) {
            return true;
          }
          return 'state name is required';
        },
        filter(val) {
          return plop.getHelper('dashCase')(val);
        },
      },
    ],
    actions: [
      {
        type: 'feature',
      },
      {
        type: 'state',
      },
    ],
  });
};
