import React, {useEffect, useState} from 'react';
import {Avatar, Text} from '@ui-kitten/components';
import generateAvatarPlaceholder from '../utils/generateAvatarPlaceholder';
import {FlatList, ListRenderItem, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Ripple from 'react-native-material-ripple';
import {useNavigation} from '@react-navigation/native';
import ChatsModel, {IChat, MessageStatus} from '../models/ChatsModel';
import {observer} from 'mobx-react-lite';
import dayjs from 'dayjs';
import {IUserModel} from '../models/UserModel';
import AccountModel from '../models/AccountModel';

const renderChats: ListRenderItem<IChat> = ({item}) => <Chat {...item} />;

const Main: React.FC = () => {
  // return (
  //   <FlatList
  //     data={ChatsModel.data}
  //     renderItem={renderChats}
  //     keyExtractor={item => item.changed.toString()}
  //   />
  // );
  console.log(ChatsModel.data, 'data');
  return (
    <React.Fragment>
      {ChatsModel.data.map((chat, index) => (
        <Chat {...chat} key={index} />
      ))}
    </React.Fragment>
  );
};

const Chat: React.FC<IChat> = observer(({members, messageHistory, id}) => {
  // const companion = members.find(member => member.id !== AccountModel.id)!;
  const [companion, setCompanion] = useState<IUserModel>();

  useEffect(() => {
    (async () => {
      const companionRef = members.find(
        member => member.id !== AccountModel.id,
      );

      if (companionRef) {
        const companionSnapshot = await companionRef.get();
        setCompanion({...companionSnapshot.data(), id: companionRef.id});
      } else {
        const myselfSnapshot = await members[0].get();
        setCompanion({...myselfSnapshot.data(), id: myselfSnapshot.id});
      }
    })();
  }, []);

  const lastMessage = messageHistory.slice(-1)[0];
  const unreadCount = messageHistory.filter(
    m => m.status === MessageStatus.UNREAD,
  ).length;
  const navigation = useNavigation();

  console.log(companion, '________');

  return (
    companion && (
      <Ripple
        style={[styles.chat]}
        onPress={() =>
          navigation.navigate('Chat', {
            userId: companion?.id,
          })
        }>
        <Avatar
          source={{
            uri:
              companion.avatar ||
              generateAvatarPlaceholder(companion.name, companion.color),
          }}
          style={styles.avatar}
        />
        <View style={styles.chatBody}>
          <Text>{companion.name}</Text>
          <Text numberOfLines={2} style={styles.chatMessage}>
            {lastMessage.text}
          </Text>
        </View>
        <View style={styles.meta}>
          <Text>{dayjs.unix(lastMessage.time?.seconds).format('hh:mm')}</Text>
          {!!unreadCount && (
            <View style={styles.counter}>
              <Text style={styles.counterText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </Ripple>
    )
  );
});

const styles = ScaledSheet.create({
  chat: {
    paddingHorizontal: '8@s',
    paddingVertical: '8@vs',
    flexDirection: 'row',
    height: '60@vs',
  },
  avatar: {
    height: '40@vs',
    width: '40@vs',
  },
  chatBody: {
    marginLeft: '8@s',
    width: '75%',
  },
  chatMessage: {
    fontSize: '11@s',
    opacity: 0.7,
    marginTop: '4@vs',
  },
  counter: {
    backgroundColor: '#0292f9',
    paddingHorizontal: '8@s',
    paddingVertical: '4@vs',
    borderRadius: '16@s',
    alignSelf: 'flex-end',
    marginTop: '4@vs',
  },
  counterText: {
    color: '#fff',
  },
  meta: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
});

export default observer(Main);
