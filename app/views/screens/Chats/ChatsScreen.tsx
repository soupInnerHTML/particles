import React, {useEffect} from 'react';
import {Keyboard, ListRenderItem} from 'react-native';
import ChatsModel, {IChat} from '../../../models/mobx/ChatsModel';
import {observer} from 'mobx-react-lite';
import Chat from '@organisms/Chat';
import useOnlineDaemon from '../../../hooks/useOnlineDaemon';
import AccountModel from '../../../models/mobx/AccountModel';
import {Layout} from '@ui-kitten/components';
import DisplayMessagesService from '../../../messaging/DisplayMessagesService';
import useAppNavigation from '@hooks/useAppNavigation';
import Animated, {
  Layout as ReanimatedLayout,
  SlideOutUp,
} from 'react-native-reanimated';
import EmptyChats from '@atoms/EmptyChats';
import SearchChatsModel from '@models/mobx/SearchChatsModel';
import BackendMessagesService from '../../../messaging/BackendMessagesService';

// BackendMessagesService.setBackgroundMessageHandler(
//   DisplayMessagesService.onMessageReceived,
// );

const renderChats: ListRenderItem<IChat> = ({item}) => (
  <Animated.View exiting={SlideOutUp}>
    <Chat {...item} />
  </Animated.View>
);

const ChatsScreen: React.FC = () => {
  useOnlineDaemon(AccountModel.id);
  const navigation = useAppNavigation();

  useEffect(() => {
    const unsubscribe = BackendMessagesService.setMessageHandler(
      DisplayMessagesService.onMessageReceived,
      id => navigation.navigate('Chat', {id, userId: AccountModel.id || ''}),
    );
    return unsubscribe;
  }, []);

  const chats = SearchChatsModel.searchQuery
    ? SearchChatsModel.data
    : ChatsModel.data;

  return (
    <Layout style={{flex: 1}}>
      <Animated.FlatList
        itemLayoutAnimation={ReanimatedLayout.springify().damping(12)}
        data={chats}
        renderItem={renderChats}
        keyExtractor={item => item.id}
        onScroll={Keyboard.dismiss}
        ListEmptyComponent={EmptyChats}
        // contentContainerStyle={{flex: 1}}
        // refreshControl={
        //   <RefreshControl
        //     tintColor={'#fff'}
        //     refreshing={ChatsModel.isPending}
        //     onRefresh={ChatsModel.getData}
        //   />
        // }
      />
    </Layout>
  );
};

export default observer(ChatsScreen);
