const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');

const BASE_DIR = 'modules';

module.exports = function(plop) {
  plop.setActionType('reducer', (answer, config, plop) => {
    const { featureName, reducerName } = answer;

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

    if (actions[reducerName]) {
      throw new Error(`${reducerName} exists in ${actions[reducerName]}`);
    }

    let filename;
    let template;
    const dirname = `${BASE_DIR}/${featureName}/state/reducers/internals`;

    filename = `${dirname}/${reducerName}.js`;
    template = `${__dirname}/templates/reducer.js.hbs`;
    template = fs.readFileSync(template, 'utf-8');
    fs.outputFileSync(filename, plop.renderString(template, { reducerName }), 'utf-8');

    return `reducer ${reducerName} has created`;
  });

  plop.setGenerator('reducer', {
    prompts: [
      {
        type: 'input',
        name: 'featureName',
        message: 'State Name?',
        validate(value) {
          if (/.+/.test(value)) {
            return true;
          }
          return 'feature name is required';
        },
        filter(val) {
          return plop.getHelper('dashCase')(val);
        },
      },
      {
        type: 'input',
        name: 'reducerName',
        message: 'Reducer Name?',
        validate(value) {
          if (/.+/.test(value)) {
            return true;
          }
          return 'Reducer name is required';
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
        type: 'reducer',
      },
    ],
  });
};
