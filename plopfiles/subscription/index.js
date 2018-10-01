const fs = require('fs-extra');

const BASE_DIR = 'modules';

module.exports = function(plop) {
  plop.setActionType('subscription', (answer, config, plop) => {
    const { featureName, subscriptionName } = answer;

    const dirname = `${BASE_DIR}/${featureName}/state/subscriptions/internals`;
    const filename = `${dirname}/${subscriptionName}.js`;
    if (fs.existsSync(filename)) {
      throw new Error(`subscription ${subscriptionName} exists`);
    }

    let template = `${__dirname}/templates/subscription.js.hbs`;
    template = fs.readFileSync(template, 'utf-8');
    fs.outputFileSync(filename, plop.renderString(template, { subscriptionName }), 'utf-8');

    return `subscription ${subscriptionName} has created`;
  });

  plop.setGenerator('subscription', {
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
        name: 'subscriptionName',
        message: 'Subscription Name?',
        validate(value) {
          if (/.+/.test(value)) {
            return true;
          }
          return 'Subscription name is required';
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
        type: 'subscription',
      },
    ],
  });
};
