const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');

const BASE_DIR = 'modules';

module.exports = function(plop) {
  plop.setActionType('effect', (answer, config, plop) => {
    const { featureName, effectName } = answer;

    const actions = {};
    const options = {
      ignore: '**/*/index.js',
    };

    glob
      .sync(`${BASE_DIR}/${featureName}/state/@(effects|reducers)/internals/*`, options)
      .forEach(file => {
        const basename = path.basename(file, path.extname(file));
        actions[basename] = file;
      });

    if (actions[effectName]) {
      throw Error(`${effectName} exists in ${actions[effectName]}`);
    }

    let filename;
    let template;
    const dirname = `${BASE_DIR}/${featureName}/state/effects/internals`;

    filename = `${dirname}/${effectName}.js`;
    template = `${__dirname}/templates/effect.js.hbs`;
    template = fs.readFileSync(template, 'utf-8');
    fs.outputFileSync(filename, plop.renderString(template, { effectName }), 'utf-8');

    return `effect ${effectName} has created`;
  });

  plop.setGenerator('effect', {
    prompts: [
      {
        type: 'input',
        name: 'featureName',
        message: 'State Name?',
        validate(value) {
          if (/.+/.test(value)) {
            return true;
          }
          return 'State name is required';
        },
        filter(val) {
          return plop.getHelper('dashCase')(val);
        },
      },
      {
        type: 'input',
        name: 'effectName',
        message: 'Effect Name?',
        validate(value) {
          if (/.+/.test(value)) {
            return true;
          }
          return 'Effect name is required';
        },
        filter(val) {
          return plop.getHelper('camelCase')(val);
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
      {
        type: 'effect',
      },
    ],
  });
};
