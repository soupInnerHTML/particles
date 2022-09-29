import React, {useEffect, useMemo, useState} from 'react';
import {ListRenderItem, View} from 'react-native';
import {Button, Input} from '@ui-kitten/components';
import {ScaledSheet} from 'react-native-size-matters';
import ChatsModel, {IMessage} from '../../../models/mobx/ChatsModel';
import {StackItem} from '../../../navigation/navigation';
import {observer} from 'mobx-react-lite';
import createIcon from '../../../utils/createIcon';
import Message from '../../molecules/Message';
import Animated, {Layout} from 'react-native-reanimated';
import dayjs from 'dayjs';
import ChipsText from '../../atoms/ChipsText';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {Layout as LayoutView} from '@ui-kitten/components';
import calendar from 'dayjs/plugin/calendar';
import {getDateRelativeToYear} from '../../../utils';
import ChatAttachment from '@molecules/ChatAttachment';

dayjs.extend(calendar);

const renderItem: ListRenderItem<IMessage | string> = ({item}) =>
  typeof item === 'string' ? (
    <View style={styles.timeChips}>
      <ChipsText>{item}</ChipsText>
    </View>
  ) : (
    <Message {...item} />
  );

const keyExtractor = (item: string | IMessage) =>
  typeof item === 'string' ? item : item.time.seconds.toString();

const ChatScreen: React.FC<StackItem<'Chat'>> = ({route}) => {
  const {id} = route.params;
  const {messageHistory} = ChatsModel.data.find(chat => chat.id === id) || {};
  const [textMessage, setTextMessage] = useState<string>();

  const sections = useMemo(() => {
    const mappedMessages: Record<string, IMessage[]> = {};
    messageHistory?.forEach(message => {
      const unix = dayjs.unix(message.time.seconds);
      const date = unix.calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]', // The day before ( Yesterday )
        lastWeek: 'dddd', // Last week ( Monday )
        sameElse: getDateRelativeToYear.bind(unix, 'MMMM DD', 'MMMM DD, YYYY'),
      });
      mappedMessages[date] = [...(mappedMessages[date] || []), message];
    });

    const parsed = [];
    for (let key in mappedMessages) {
      parsed.push(...mappedMessages[key], key);
    }
    return parsed;
  }, [messageHistory]);

  useEffect(() => {
    ChatsModel.readMessages(id);
  }, [messageHistory?.length]);

  const [attachedPhotos, setAttachedPhotos] = useState<Asset[]>();

  async function attachPhotos() {
    const result = await launchImageLibrary({
      includeBase64: true,
      mediaType: 'photo',
      selectionLimit: 0,
    });

    setAttachedPhotos(actual => [...(actual ?? []), ...(result.assets || [])]);
  }

  return (
    <LayoutView style={{flex: 1}}>
      <Animated.FlatList
        {...{keyExtractor, renderItem}}
        inverted
        itemLayoutAnimation={Layout.springify()}
        data={sections}
      />
      {/*<View style={styles.container}>*/}
      <ChatAttachment
        photos={attachedPhotos}
        removeItem={index =>
          setAttachedPhotos(actual =>
            actual?.filter((_, _index) => index !== _index),
          )
        }
      />
      <View style={styles.messageSend}>
        <Input
          value={textMessage}
          onChangeText={setTextMessage}
          multiline
          style={styles.sendInput}
          placeholder={'Message'}
          accessoryLeft={createIcon('attach-outline', attachPhotos)}
          accessoryRight={createIcon('smiling-face-outline')}
        />
        <Button
          disabled={!(textMessage || attachedPhotos)}
          accessoryLeft={createIcon('arrow-upward-outline')}
          style={styles.sendButton}
          onPress={() => {
            setTextMessage('');
            setAttachedPhotos(undefined);
            ChatsModel.sendMessage(id, {
              text: textMessage,
              photos: attachedPhotos,
            });
          }}
        />
      </View>
      {/*</View>*/}
    </LayoutView>
  );
};

const styles = ScaledSheet.create({
  container: {
    paddingHorizontal: '8@s',
  },
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
  timeChips: {
    transform: [{rotateZ: '180deg'}, {rotateY: '180deg'}],
    alignSelf: 'center',
    marginVertical: '4@vs',
  },
});

export default observer(ChatScreen);
