import React, {useEffect} from 'react';
import SplashScreen from 'react-native-lottie-splash-screen';
import RootNavigationContainer from '../navigation/RootNavigationContainer';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import FlashMessageRegistry from 'react-native-flash-message';
import 'react-native-get-random-values';

GoogleSignin.configure();

const App: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <FlashMessageRegistry position="top" />
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <RootNavigationContainer />
      </ApplicationProvider>
    </SafeAreaView>
  );
};

export default App;
