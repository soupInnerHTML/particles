import React, {useEffect} from 'react';
import {FlatList, ListRenderItem, RefreshControl} from 'react-native';
import ChatsModel, {IChat} from '../../../models/mobx/ChatsModel';
import {observer} from 'mobx-react-lite';
import Chat from '../../molecules/Chat';
import useOnlineDaemon from '../../../hooks/useOnlineDaemon';
import AccountModel from '../../../models/mobx/AccountModel';
import {Layout} from '@ui-kitten/components';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {
  AndroidCategory,
  AndroidColor,
  AndroidImportance,
} from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';

async function onMessageReceived(
  message: FirebaseMessagingTypes.RemoteMessage,
) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    sound: 'bruh',
  });

  // Display a notification
  await notifee.displayNotification({
    title: message.notification?.title,
    body: message.notification?.body,
    android: {
      channelId,
      smallIcon: 'ic_notification', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
      sound: 'bruh',
      largeIcon: message.data?.avatar,
      color: AndroidColor.YELLOW,
      importance: AndroidImportance.HIGH,
      circularLargeIcon: true,
      category: AndroidCategory.SOCIAL,
    },
    ios: {
      sound: '',
      badgeCount: 100,
    },
  });
}

messaging().setBackgroundMessageHandler(onMessageReceived);

const renderChats: ListRenderItem<IChat> = ({item}) => <Chat {...item} />;

const ChatsScreen: React.FC = () => {
  useOnlineDaemon(AccountModel.id);
  const {placeholder, data} = ChatsModel;

  useEffect(() => {
    messaging()
      .getToken()
      .then(t => AccountModel.updateFcmToken(t));
    const unsubToken = messaging().onTokenRefresh(t =>
      AccountModel.updateFcmToken(t),
    );

    const unsub = messaging().onMessage(onMessageReceived);

    return () => {
      unsub();
      unsubToken();
    };
  });

  return (
    <Layout style={{flex: 1}}>
      <FlatList
        data={data.length ? data : placeholder}
        renderItem={renderChats}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            tintColor={'#fff'}
            refreshing={ChatsModel.isPending}
            onRefresh={ChatsModel.getData}
          />
        }
      />
    </Layout>
  );
  // return (
  //   <Layout style={{flex: 1}}>
  //     {ChatsModel.data.map((chat, index) => (
  //       <Chat {...chat} key={index} />
  //     ))}
  //   </Layout>
  // );
};

export default observer(ChatsScreen);
