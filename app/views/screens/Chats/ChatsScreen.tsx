import React from 'react';
import {FlatList, ListRenderItem, RefreshControl} from 'react-native';
import ChatsModel, {IChat} from '../../../models/mobx/ChatsModel';
import {observer} from 'mobx-react-lite';
import Chat from '../../molecules/Chat';
import useOnlineDaemon from '../../../hooks/useOnlineDaemon';
import AccountModel from '../../../models/mobx/AccountModel';
import {Layout} from '@ui-kitten/components';

const renderChats: ListRenderItem<IChat> = ({item}) => <Chat {...item} />;

const ChatsScreen: React.FC = () => {
  useOnlineDaemon(AccountModel.id);
  const {placeholder, data} = ChatsModel;

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
