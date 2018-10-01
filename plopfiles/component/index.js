const fs = require('fs-extra');

const BASE_DIR = 'modules';

module.exports = function(plop) {
  plop.setActionType('component', (answer, config, plop) => {
    const { directory, componentName, type } = answer;

    let componentDir = `${BASE_DIR}/${directory}/${componentName}`;
    if (directory !== 'components') {
      componentDir = `${BASE_DIR}/${directory}/components/${componentName}`;
    }
    const dirname = `${componentDir}`;
    if (fs.existsSync(dirname)) {
      throw new Error(`${componentName} exists`);
    }

    let filename;
    let template;

    filename = `${dirname}/index.js`;
    template = `${__dirname}/templates/index.js.hbs`;
    template = fs.readFileSync(template, 'utf-8');
    fs.outputFileSync(filename, plop.renderString(template, { componentName }), 'utf-8');

    filename = `${dirname}/component.js`;
    template = `${__dirname}/templates/component.${type}.js.hbs`;
    template = fs.readFileSync(template, 'utf-8');
    fs.outputFileSync(filename, plop.renderString(template, { componentName }), 'utf-8');

    return `${componentName} has created`;
  });

  plop.setGenerator('component', {
    prompts: [
      {
        type: 'directory',
        name: 'directory',
        message: 'Directory?',
        basePath: BASE_DIR,
        validate(value) {
          if (/.+/.test(value)) {
            return true;
          }
          return 'Directory is required';
        },
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'Component Name?',
        validate(value) {
          if (/.+/.test(value)) {
            return true;
          }
          return 'Component name is required';
        },
        filter(val) {
          return plop.getHelper('pascalCase')(val);
        },
      },
      {
        type: 'list',
        name: 'type',
        message: 'What component type do you want to generate?',
        choices: ['Arrow', 'Class'],
        filter(val) {
          return val.toLowerCase();
        },
        default: 'arrow',
      },
    ],
    actions: [
      {
        type: 'component',
      },
    ],
  });
};
