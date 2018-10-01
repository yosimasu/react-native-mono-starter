const inquirerDirectory = require('inquirer-directory');

const plopfiles = require('require-all')({
  dirname: `${__dirname}/plopfiles`,
});

module.exports = function(plop) {
  plop.setPrompt('directory', inquirerDirectory);

  Object.keys(plopfiles).forEach(key => {
    plopfiles[key].index(plop);
  });
};
