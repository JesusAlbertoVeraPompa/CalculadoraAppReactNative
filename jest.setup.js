const {jest: jestGlobals} = require('@jest/globals');

jestGlobals.mock('react-native-linear-gradient', () => 'LinearGradient');
