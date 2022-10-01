import React, {useEffect} from 'react';
import SplashScreen from 'react-native-lottie-splash-screen';
import RootNavigationContainer from '../navigation/RootNavigationContainer';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry, Layout} from '@ui-kitten/components';
import {SafeAreaView, StatusBar, KeyboardAvoidingView} from 'react-native';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import FlashMessageRegistry from 'react-native-flash-message';
import 'react-native-get-random-values';
import {observer} from 'mobx-react-lite';
import AccountModel from '@models/mobx/AccountModel';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

GoogleSignin.configure();

async function onMessageReceived(
  message: FirebaseMessagingTypes.RemoteMessage,
) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: message.notification?.title,
    body: message.notification?.body,
    android: {
      channelId,
      smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      sound: '',
      badgeCount: 100,
    },
  });
}

const App: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide();
    messaging()
      .getToken()
      .then(t => console.log(t));

    onMessageReceived({notification: {title: 'Test', body: 'Test'}});

    const unsub = messaging().onMessage(onMessageReceived);

    return () => unsub();
    // messaging().setBackgroundMessageHandler(onMessageReceived);
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
      <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
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
