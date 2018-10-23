const fs = require('fs-extra');

const BASE_DIR = 'modules';

module.exports = function(plop) {
  plop.setActionType('screen', (answer, config, plop) => {
    const { directory } = answer;

    if (!fs.existsSync(`${BASE_DIR}/${directory}/component.js`)) {
      return `${BASE_DIR}/${directory} doesn't contain component.js`;
    }

    if (fs.existsSync(`${BASE_DIR}/${directory}/screen.js`)) {
      return 'exists';
    }

    let screenSource = 'component';
    if (fs.existsSync(`${BASE_DIR}/${directory}/container.js`)) {
      screenSource = 'container';
    }

    let filename;
    let template;

    filename = `${BASE_DIR}/${directory}/index.js`;
    template = `${__dirname}/templates/index.js.hbs`;
    template = fs.readFileSync(template, 'utf-8');
    fs.outputFileSync(filename, plop.renderString(template, {}), 'utf-8');

    filename = `${BASE_DIR}/${directory}/screen.js`;
    template = `${__dirname}/templates/screen.js.hbs`;
    template = fs.readFileSync(template, 'utf-8');
    fs.outputFileSync(filename, plop.renderString(template, { screenSource }), 'utf-8');

    return `created`;
  });

  plop.setGenerator('screen', {
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
    ],
    actions: [
      {
        type: 'screen',
      },
    ],
  });
};
