/**
 * @format
 */

import {configure} from 'mobx';
import {AppRegistry} from 'react-native';
import {name as appName} from './package.json';
import {enableScreens} from 'react-native-screens';
import App from './app/views/App';

enableScreens();

configure({
  enforceActions: 'never',
});

AppRegistry.registerComponent(appName, () => App);
