import React from 'react';
import {View} from 'react-native';
import {Button, Input} from '@ui-kitten/components';
import createIcon from '@utils/createIcon';
import ChatsModel from '@models/mobx/ChatsModel';
import {ScaledSheet} from 'react-native-size-matters';
import {Asset} from 'react-native-image-picker';
import {useRoute} from '@react-navigation/native';
import {IRoute} from '../../navigation/navigation.types';
import {observer} from 'mobx-react-lite';
import {useTyping} from '@hooks/useTyping';

interface ISendMessageChatAreaProps {
  textMessage?: string;
  setTextMessage: (a?: string) => void;
  attachPhotos: () => void;
  attachedPhotos?: Asset[];
  setAttachedPhotos: (a: Asset[] | null) => void;
}

const SendMessageChatArea: React.FC<ISendMessageChatAreaProps> = ({
  textMessage,
  setTextMessage,
  attachPhotos,
  attachedPhotos,
  setAttachedPhotos,
}) => {
  const {
    params: {id: chatId, userId},
  } = useRoute<IRoute<'Chat'>>();

  useTyping(textMessage);

  return (
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
          setAttachedPhotos(null);
          ChatsModel.sendMessage(chatId, userId, {
            text: textMessage,
            photos: attachedPhotos,
          });
        }}
      />
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
    paddingBottom: '4@vs',
  },
  sendInput: {
    flex: 1,
    borderRadius: '16@s',
  },
  sendButton: {
    borderRadius: 100,
    width: '8@s',
    height: '8@s',
    marginLeft: '5@s',
  },
});

export default observer(SendMessageChatArea);
