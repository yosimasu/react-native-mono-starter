import React from 'react';
import { dva } from '@modules/core';
import { StyleSheet, Text, View } from '@modules/components';

import state from './state';
import features from './features';

let states = [state];
features.forEach(feature => {
  if (feature.state) {
    states.push(feature.state);
  }
});

const app = dva({
  initialState: {},
  models: states,
  onError(e, dispatch) {
    if (__DEV__) {
      console.log('onError', e);
    }
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default app.start(
  <View style={styles.container}>
    <Text>Open up App.js to start working on your app!</Text>
    <Text>Changes you make will automatically reload.</Text>
    <Text>Shake your phone to open the developer menu.</Text>
  </View>
);
