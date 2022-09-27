import React, {useEffect, useRef, useState} from 'react';
import {FlatList, ListRenderItem, View} from 'react-native';
import {Button, Icon, Input, Text, useTheme} from '@ui-kitten/components';
import {ScaledSheet} from 'react-native-size-matters';
import ChatsModel, {IMessage} from '../models/ChatsModel';
import {StackItem} from '../navigation/navigation';
import {observer} from 'mobx-react-lite';
import AccountModel from '../models/AccountModel';
import dayjs from 'dayjs';

const Send = props => {
  return <Icon name={'arrow-upward-outline'} {...props} />;
};

const Clip = props => {
  return <Icon name={'attach-outline'} {...props} />;
};

const Emoji = props => {
  return <Icon name={'smiling-face-outline'} {...props} />;
};

const Check = props => {
  return <Icon name={'checkmark-outline'} {...props} />;
};

const Message: React.FC<IMessage> = ({text, author, time}) => {
  const theme = useTheme();
  const isOwn = author?.id === AccountModel.id;
  return (
    <View
      style={[
        styles.message,
        isOwn ? styles.messageRight : styles.messageLeft,
        {
          backgroundColor: isOwn
            ? theme['color-primary-500']
            : theme['color-success-600'],
        },
      ]}>
      <Text status={'control'}>{text}</Text>
      <View style={{flexDirection: 'row'}}>
        <Text status={'control'} style={styles.time}>
          {dayjs.unix(time?.seconds).format('hh:mm')}
        </Text>
        <Check color={'#000'} width={16} height={16} />
      </View>
    </View>
  );
};

const renderMessage: ListRenderItem<IMessage> = ({item}) => (
  <Message {...item} />
);

const Chat: React.FC<StackItem<'Chat'>> = ({route}) => {
  const {id} = route.params;
  const {messageHistory} = ChatsModel.data.find(chat => chat.id === id) || {};
  const [textMessage, setTextMessage] = useState<string>();
  const flatList = useRef<FlatList>(null);
  useEffect(() => {
    flatList.current?.scrollToOffset({offset: Number.MAX_VALUE});
  }, [messageHistory?.length]);
  return (
    <View style={{flex: 1}}>
      <FlatList
        ref={flatList}
        data={messageHistory}
        renderItem={renderMessage}
      />
      <View style={styles.messageSend}>
        <Input
          value={textMessage}
          onChangeText={setTextMessage}
          multiline
          style={styles.sendInput}
          placeholder={'Message'}
          accessoryLeft={Clip}
          accessoryRight={Emoji}
        />
        <Button
          disabled={!textMessage}
          accessoryLeft={Send}
          style={styles.sendButton}
          onPress={() => {
            ChatsModel.sendMessage(id, textMessage!);
            setTextMessage('');
          }}
        />
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  messageSend: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: '8@s',
  },
  sendButton: {
    borderRadius: 100,
    width: '8@s',
    height: '8@s',
    marginLeft: '5@s',
  },
  sendInput: {
    flex: 1,
    borderRadius: '16@s',
  },
  message: {
    paddingVertical: '8@vs',
    paddingHorizontal: '12@s',
    marginVertical: '2@vs',
    borderRadius: '16@s',
  },
  messageLeft: {
    marginLeft: '4@s',
    borderBottomLeftRadius: 0,
    marginRight: 'auto',
    alignItems: 'flex-start',
  },
  messageRight: {
    marginRight: '4@s',
    borderBottomRightRadius: 0,
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  time: {
    fontWeight: '300',
    fontSize: '11@s',
  },
});

export default observer(Chat);
