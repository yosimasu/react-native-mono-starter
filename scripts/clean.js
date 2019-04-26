const shell = require('shelljs');

const oldSilentState = shell.config.silent;

shell.config.silent = true;

shell.echo('Cleaning ios staff');
shell.rm('-rf', './ios/build');
shell.rm('-rf', './ios/Pods');
shell.rm('-rf', './ios/Podfile.lock');

shell.echo('Cleaning android staff');
shell.cd('android');
shell.exec('./gradlew clean');
shell.cd('-');

shell.echo('Cleaning node staff');
shell.exec('lerna clean --yes');
shell.rm('-rf', 'node_modules');

shell.config.silent = oldSilentState;
