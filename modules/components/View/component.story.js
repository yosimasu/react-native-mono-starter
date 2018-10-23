import React from 'react';

import { storiesOf } from '@storybook/react-native';
// import { action } from '@storybook/addon-actions';

import View from './component';

const name = 'modules/components/View/component';

const load = () => {
  const story = storiesOf(name, module);

  story.add('blank', () => {
    return <View />;
  });
};

export { name, load };
