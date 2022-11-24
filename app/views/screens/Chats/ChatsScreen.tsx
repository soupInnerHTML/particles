import React, {useEffect} from 'react';
import {AppState, FlatList, ListRenderItem, RefreshControl} from 'react-native';
import ChatsModel, {IChat} from '../../../models/mobx/ChatsModel';
import {observer} from 'mobx-react-lite';
import Chat from '../../molecules/Chat';
import useOnlineDaemon from '../../../hooks/useOnlineDaemon';
import AccountModel from '../../../models/mobx/AccountModel';
import {Layout} from '@ui-kitten/components';
import messaging from '@react-native-firebase/messaging';
import {onMessagePress, onMessageReceived} from '../../../messages';
import useAppNavigation from '@hooks/useAppNavigation';

// messaging().setBackgroundMessageHandler(onMessageReceived);

const renderChats: ListRenderItem<IChat> = ({item}) => <Chat {...item} />;

const ChatsScreen: React.FC = () => {
  useOnlineDaemon(AccountModel.id);
  const {placeholder, data, searchData, searchPath} = ChatsModel;
  const navigation = useAppNavigation();

  useEffect(() => {
    messaging()
      .getToken()
      .then(t => AccountModel.updateFcmToken(t));
    const unsubToken = messaging().onTokenRefresh(t =>
      AccountModel.updateFcmToken(t),
    );

    let unsubOnMessage = messaging().onMessage(onMessageReceived);

    AppState.addEventListener('change', nextAppState => {
      switch (nextAppState) {
        case 'background':
        case 'inactive':
          return unsubOnMessage();
        case 'active':
          unsubOnMessage = messaging().onMessage(onMessageReceived);
      }
    });

    const unsubMessagePress = onMessagePress(id =>
      navigation.navigate('Chat', {id, userId: AccountModel.id || ''}),
    );

    return () => {
      unsubToken();
      unsubMessagePress();
    };
  }, []);

  const chats = (() => {
    if (searchPath) {
      return searchData;
    } else if (data.length) {
      return data;
    } else {
      return placeholder;
    }
  })();

  return (
    <Layout style={{flex: 1}}>
      <FlatList
        data={chats}
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
};

export default observer(ChatsScreen);
