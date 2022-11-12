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
import 'react-native-get-random-values';
import {observer} from 'mobx-react-lite';
import AccountModel from '@models/mobx/AccountModel';

GoogleSignin.configure();

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
      <FlashMessageRegistry position="top" />
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
    </SafeAreaView>
  );
};

export default observer(App);
