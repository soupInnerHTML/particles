/**
 * @format
 */

import {Navigation} from 'react-native-navigation';
import Posts from './app/views/Posts';
import {configure} from 'mobx';
import SignInForm from './app/views/SignInForm';
import {NavigationComponents} from './app/navigation';
import SignUpForm from './app/views/SignUpForm';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

configure({
  enforceActions: 'never',
});

Navigation.registerComponent(NavigationComponents.POSTS, () =>
  gestureHandlerRootHOC(Posts),
);
Navigation.registerComponent(NavigationComponents.SIGN_IN_FORM, () =>
  gestureHandlerRootHOC(SignInForm),
);
Navigation.registerComponent(NavigationComponents.SIGN_UP_FORM, () =>
  gestureHandlerRootHOC(SignUpForm),
);
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            //   component: {
            //     name: NavigationComponents.POSTS,
            //     options: {
            //       topBar: {
            //         title: {
            //           text: 'Posts',
            //         },
            //       },
            //     },
            //   },
            // },
            // {
            component: {
              name: NavigationComponents.SIGN_IN_FORM,
            },
          },
          // {
          //   component: {
          //     name: NavigationComponents.SIGN_UP_FORM,
          //   },
          // },
        ],
      },
    },
  });
});
