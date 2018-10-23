import React from 'react';

import { storiesOf } from '@storybook/react-native';
// import { action } from '@storybook/addon-actions';

import Text from './component';

const name = 'modules/components/Text/component';

const load = () => {
  const story = storiesOf(name, module);

  story.add('default', () => {
    return <Text>Text</Text>;
  });
};

export { name, load };
