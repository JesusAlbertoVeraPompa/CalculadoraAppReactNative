import React from 'react';
import {StatusBar, View} from 'react-native';
import {CalculadoraScreen} from './src/screens/CalculadoraScreen';
import {GlobalTheme} from './src/theme/global-theme';

export const App = () => {
  return (
    <View style={GlobalTheme.homeScreenContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#050510" />
      <CalculadoraScreen />
    </View>
  );
};
