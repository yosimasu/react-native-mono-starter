const fs = require('fs-extra');

const BASE_DIR = 'modules';

module.exports = function(plop) {
  plop.setActionType('container', (answer, config, plop) => {
    const { directory } = answer;

    if (!fs.existsSync(`${BASE_DIR}/${directory}/component.js`)) {
      return `${BASE_DIR}/${directory} doesn't contain component.js`;
    }

    if (fs.existsSync(`${BASE_DIR}/${directory}/container.js`)) {
      return 'exists';
    }

    let containerSource = 'component';
    if (fs.existsSync(`${BASE_DIR}/${directory}/form.js`)) {
      containerSource = 'form';
    }

    let filename;
    let template;

    filename = `${BASE_DIR}/${directory}/index.js`;
    template = `${__dirname}/templates/index.js.hbs`;
    template = fs.readFileSync(template, 'utf-8');
    fs.outputFileSync(filename, plop.renderString(template, {}), 'utf-8');

    filename = `${BASE_DIR}/${directory}/container.js`;
    template = `${__dirname}/templates/container.js.hbs`;
    template = fs.readFileSync(template, 'utf-8');
    fs.outputFileSync(filename, plop.renderString(template, { containerSource }), 'utf-8');

    return `created`;
  });

  plop.setGenerator('container', {
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
        type: 'container',
      },
    ],
  });
};
