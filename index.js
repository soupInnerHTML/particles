/**
 * @format
 */

import {configure} from 'mobx';
import {AppRegistry, Platform} from 'react-native';
// import {name as appName} from './app.json';
import {enableScreens} from 'react-native-screens';
import App from './app/views/App';

enableScreens();

configure({
  enforceActions: 'never',
});

AppRegistry.registerComponent(
  Platform.select({ios: 'particles', android: 'Particles'}),
  () => App,
);
