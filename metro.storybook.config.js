var path = require("path");

module.exports = {
  projectRoot: path.resolve(__dirname, 'storybook'),
  watchFolders: [
    path.resolve(__dirname),
  ],
};
