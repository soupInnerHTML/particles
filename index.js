/**
 * @format
 */

import {Navigation} from 'react-native-navigation';
import App from './app/views/App';

Navigation.registerComponent('root', () => App);
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'root',
            },
          },
        ],
      },
    },
  });
});
