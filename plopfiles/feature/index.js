const fs = require('fs-extra');

const { version: packageVersion } = require('../../package.json');

const BASE_DIR = 'modules';

module.exports = function(plop) {
  plop.setActionType('feature', (answer, config, plop) => {
    const { featureName } = answer;

    const dirname = `${BASE_DIR}/${featureName}`;
    if (fs.existsSync(dirname)) {
      return `feature ${featureName} exists`;
    }

    let filename;
    let template;

    filename = `${dirname}/index.js`;
    template = `${__dirname}/templates/index.js.hbs`;
    template = fs.readFileSync(template, 'utf-8');
    fs.outputFileSync(
      filename,
      plop.renderString(template, { featureName, packageVersion }),
      'utf-8'
    );

    filename = `${dirname}/package.json`;
    template = `${__dirname}/templates/package.json.hbs`;
    template = fs.readFileSync(template, 'utf-8');
    fs.outputFileSync(
      filename,
      plop.renderString(template, { featureName, packageVersion }),
      'utf-8'
    );

    return `feature ${featureName} has created`;
  });

  plop.setGenerator('feature', {
    prompts: [
      {
        type: 'input',
        name: 'featureName',
        message: 'Feature Name?',
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
    ],
    actions: [
      {
        type: 'feature',
      },
    ],
  });
};
