import React, {useEffect} from 'react';
import SplashScreen from 'react-native-lottie-splash-screen';
import RootNavigationContainer from '../navigation/RootNavigationContainer';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry, Layout} from '@ui-kitten/components';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import FlashMessageRegistry from 'react-native-flash-message';
import {observer} from 'mobx-react-lite';
import AccountModel from '@models/mobx/AccountModel';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {compose} from 'lodash/fp';

GoogleSignin.configure({
  webClientId:
    '467302315890-rjojkpn1elfp9i4oet8bif2ja0nt1e31.apps.googleusercontent.com',
});

const App: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const theme = eva[AccountModel.theme];
  const bgColor = theme[theme['background-basic-color-1'].replace('$', '')];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: bgColor,
      }}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={theme}>
          <Layout style={{flex: 1}}>
            <StatusBar
              backgroundColor={bgColor}
              barStyle={
                AccountModel.theme === 'dark' ? 'light-content' : 'dark-content'
              }
              animated
            />
            <RootNavigationContainer />
          </Layout>
        </ApplicationProvider>
      </KeyboardAvoidingView>
      <FlashMessageRegistry position="top" />
    </SafeAreaView>
  );
};

export default compose(gestureHandlerRootHOC, observer)(App);
