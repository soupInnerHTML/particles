import notifee from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import AccountModel from '@models/mobx/AccountModel';
import {AppState} from 'react-native';

type Handler = (message: FirebaseMessagingTypes.RemoteMessage) => Promise<any>;

class BackendMessagesService {
  async bootstrap() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();
    await messaging().registerDeviceForRemoteMessages();

    messaging()
      .getToken()
      .then(t => AccountModel.updateFcmToken(t));
    return messaging().onTokenRefresh(t => AccountModel.updateFcmToken(t));
  }
  setBackgroundMessageHandler(handler: Handler) {
    messaging().setBackgroundMessageHandler(handler);
  }
  onMessagePress(handler: Handler) {
    return messaging().onNotificationOpenedApp(handler);
  }
  async setMessageHandler(handler: Handler, messagePressHandler: Handler) {
    const unsubBoot = await this.bootstrap();

    let unsubOnMessage = messaging().onMessage(handler);
    AppState.addEventListener('change', nextAppState => {
      switch (nextAppState) {
        case 'background':
        case 'inactive':
          return unsubOnMessage();
        case 'active':
          unsubOnMessage = messaging().onMessage(handler);
      }
    });

    const unsubMessagePress = this.onMessagePress(messagePressHandler);

    // const unsubMessagePress = DisplayMessagesService.onMessagePress(id =>
    //   navigation.navigate('Chat', {id, userId: AccountModel.id || ''}),
    // );
    //
    return () => {
      unsubBoot();
      unsubMessagePress();
      unsubOnMessage();
    };
  }
}

export default new BackendMessagesService();
