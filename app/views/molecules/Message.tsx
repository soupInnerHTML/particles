import React, {useMemo} from 'react';
import ChatsModel, {
  IMessage,
  MessageStatus,
} from '../../models/mobx/ChatsModel';
import {Text, useTheme} from '@ui-kitten/components';
import AccountModel from '../../models/mobx/AccountModel';
import {TouchableOpacity, View} from 'react-native';
import dayjs from 'dayjs';
import {ScaledSheet} from 'react-native-size-matters';
import ReadStatusIcon from '../atoms/ReadStatusIcon';
import Row from '../atoms/Row';
import Animated, {SlideInLeft, SlideInRight} from 'react-native-reanimated';
import ImageModal from 'react-native-image-modal';
import VisibilitySensor from '@svanboxel/visibility-sensor-react-native';
import {useRoute} from '@react-navigation/native';
import {IRoute} from '../../navigation/navigation';
import showContextActions from '@utils/showContextActions';

function openContextActions(
  chatId: string,
  messageId: string,
  text: string | undefined,
) {
  showContextActions([
    {
      title: 'Delete',
      callback: () => ChatsModel.deleteMessage(chatId, messageId),
      destructive: true,
    },
    {
      title: 'Edit',
      callback: () => ChatsModel.editMessage(text, chatId, messageId),
    },
    {
      title: 'Copy',
      callback: () => ChatsModel.copyMessage(text),
    },
  ]);
}

function openCompanionContextActions(text: string | undefined) {
  showContextActions([
    {
      title: 'Copy',
      callback: () => ChatsModel.copyMessage(text),
    },
  ]);
}

const Message: React.FC<IMessage> = ({
  text,
  author,
  time,
  status,
  photos,
  id,
  edited,
}) => {
  const theme = useTheme();
  const isOwn = author?.id === AccountModel.id;
  const messageTime = useMemo(
    () => dayjs.unix(time?.seconds).format('HH:mm'),
    [time?.seconds],
  );
  const {
    params: {id: chatId},
  } = useRoute<IRoute<'Chat'>>();

  return (
    // <VisibilitySensor
    //   onChange={() => {
    //     if (author?.id !== AccountModel.id && status !== MessageStatus.READ) {
    //       ChatsModel.readMessages(chatId, id);
    //     }
    //   }}>
    <Animated.View entering={isOwn ? SlideInRight : SlideInLeft}>
      <TouchableOpacity
        onLongPress={() =>
          isOwn
            ? openContextActions(chatId, id, text)
            : openCompanionContextActions(text)
        }
        style={[
          styles.message,
          isOwn ? styles.messageRight : styles.messageLeft,
          photos?.length && !text
            ? {}
            : {
                backgroundColor: isOwn
                  ? theme['color-primary-500']
                  : theme['color-success-600'],
              },
        ]}>
        {photos?.map(photo => (
          <ImageModal
            modalImageResizeMode={'contain'}
            source={{uri: photo}}
            style={styles.image}
          />
        ))}
        <View
          style={[styles.messageTextData, !text && styles.absMessageTextData]}>
          <Text status={'control'}>{text}</Text>
          <Row
            alignItems={'flex-end'}
            justifyContent={isOwn ? 'flex-end' : 'flex-start'}>
            {edited && (
              <Text status={'control'} style={styles.edited}>
                edited
              </Text>
            )}
            <Text status={'control'} style={styles.time}>
              {messageTime}
            </Text>
            <ReadStatusIcon
              status={status}
              fill={theme['color-basic-100']}
              width={16}
              height={16}
            />
          </Row>
        </View>
      </TouchableOpacity>
    </Animated.View>
    // </VisibilitySensor>
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
    marginVertical: '2@vs',
    borderRadius: '16@s',
    transform: [{rotateZ: '180deg'}, {rotateY: '180deg'}],
    overflow: 'hidden',
  },
  messageTextData: {
    paddingVertical: '8@vs',
    paddingHorizontal: '12@s',
  },
  absMessageTextData: {
    position: 'absolute',
    bottom: 0,
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
    marginRight: 1,
  },
  edited: {
    fontWeight: '300',
    fontSize: '10@s',
    marginRight: 3,
    fontStyle: 'italic',
  },
  image: {
    width: '200@s',
    height: '200@s',
    overflow: 'hidden',
  },
});

export default Message;
