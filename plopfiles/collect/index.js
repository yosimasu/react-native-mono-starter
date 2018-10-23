const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const shell = require('shelljs');

const BASE_DIR = 'modules';

const _base = (source, file) => {
  const bases = {
    components(file) {
      return path.dirname(file);
    },
    internals(file) {
      return file;
    },
    states(file) {
      return path.dirname(file);
    },
    screens(file) {
      return path.dirname(file);
    },
    stories(file) {
      return file;
    },
  };

  return bases[source](file);
};

const _dirname = (source, base) => {
  const dirnames = {
    components(base) {
      return path.dirname(base);
    },
    internals(base) {
      return path.dirname(base);
    },
    states(base) {
      return path.dirname(base);
    },
    screens(base) {
      return path
        .dirname(base)
        .split(path.sep)
        .slice(0, 2)
        .join(path.sep);
    },
    stories(base) {
      return path
        .dirname(base)
        .split(path.sep)
        .slice(0, 2)
        .join(path.sep);
    },
  };

  return dirnames[source](base);
};

const _basename = (source, base) => {
  const basenames = {
    components(base) {
      return path.basename(base, path.extname(base));
    },
    internals(base) {
      return path.basename(base, path.extname(base));
    },
    states(base) {
      return path.basename(base, path.extname(base));
    },
    screens(base) {
      return path
        .relative(_dirname('screens', base), base)
        .split(path.sep)
        .filter(dir => dir !== 'components')
        .join('/')
        .toUpperCase();
    },
    stories(base) {
      return base;
    },
  };

  return basenames[source](base);
};

const _collect = (source, base) => {
  const collections = {
    components(base) {
      return `./${_basename('components', base)}`;
    },
    internals(base) {
      return `./${_basename('internals', base)}`;
    },
    states(base) {
      return `./${_basename('states', base)}`;
    },
    screens(base) {
      return {
        declare: _basename('screens', base)
          .replace(/\//g, '_')
          .toLowerCase(),
        component: `./${path.relative(_dirname('screens', base), base)}`,
      };
    },
    stories(base) {
      return `./${path.relative(_dirname('stories', base), base)}`;
    },
  };

  return collections[source](base);
};

const _refactor = (source, filename) => {
  const refactors = {
    components(filename) {},
    internals(filename) {},
    states(filename) {},
    screens(filename) {},
    stories(filename) {
      if (shell.which('jscodeshift')) {
        shell.exec(`jscodeshift -s -t codemods/story-name.js ${filename} --dirname=${BASE_DIR}`);
      }
    },
  };

  refactors[source](filename);
};

module.exports = function(plop) {
  plop.setActionType('collect', (answer, config, plop) => {
    const collections = {};

    const ignore = ['**/*/__*__', ...(config.ignore || [])];
    if (config.kind === 'index') {
      ignore.push('**/*/index.js');
    }
    const options = {
      ignore,
    };
    glob.sync(config.pattern, options).forEach(file => {
      _refactor(config.source, file);

      const base = _base(config.source, file);

      const dirname = _dirname(config.source, base);
      const collection = collections[dirname] || {};

      const basename = _basename(config.source, base);
      collection[basename] = _collect(config.source, base);

      collections[dirname] = collection;
    });

    let filename;
    let template;
    const { target = 'index.js' } = config;
    Object.keys(collections).forEach(collection => {
      filename = `${collection}/${target}`;
      template = config.template;
      if (template) {
        template = fs.readFileSync(template, 'utf-8');
        fs.outputFileSync(
          filename,
          plop.renderString(template, { collections: collections[collection] }),
          'utf-8'
        );
      }
    });
    if (shell.which('eslint')) {
      shell.exec(`eslint ${BASE_DIR} --quiet --fix`);
    }

    return `${config.source} OK`;
  });

  plop.setGenerator('collect', {
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'What type do you want to collect?',
        choices: ['All', 'Components', 'Internals', 'Screens', 'Stories'],
        filter(val) {
          return val.toLowerCase();
        },
        default: 'all',
      },
    ],
    actions: ({ type }) => {
      const collections = {
        components: {
          type: 'collect',
          pattern: `${BASE_DIR}/**/components/*/index.js`,
          template: `${__dirname}/templates/components.js.hbs`,
          source: 'components',
          kind: 'dir',
        },
        internals: {
          type: 'collect',
          pattern: `${BASE_DIR}/**/internals/*`,
          template: `${__dirname}/templates/internals.js.hbs`,
          source: 'internals',
          kind: 'index',
        },
        screens: {
          type: 'collect',
          pattern: `${BASE_DIR}/**/components/*/screen.js`,
          template: `${__dirname}/templates/screens.js.hbs`,
          source: 'screens',
          kind: 'dir',
          target: 'screens.js',
          feature: true,
        },
        stories: {
          type: 'collect',
          pattern: `${BASE_DIR}/**/*.story.js`,
          template: `${__dirname}/templates/stories.js.hbs`,
          source: 'stories',
          kind: 'index',
          target: 'stories.js',
          feature: true,
        },
      };

      if (type === 'all') {
        return Object.keys(collections).map(key => collections[key]);
      } else {
        return [collections[type]];
      }
    },
  });
};
