import React, {useState} from 'react';
import {Layout as LayoutView} from '@ui-kitten/components';
import {StackItem} from '../../../navigation/navigation.types';
import {observer} from 'mobx-react-lite';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import ChatAttachment from '@molecules/ChatAttachment';
import SendMessageChatArea from '@atoms/SendMessageChatArea';
import ChatMessages from '@organisms/ChatMessages';

const ChatScreen: React.FC<StackItem<'Chat'>> = () => {
  const [textMessage, setTextMessage] = useState<string>('');
  const [attachedPhotos, setAttachedPhotos] = useState<Asset[] | null>(null);

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
      <ChatMessages />
      <ChatAttachment
        photos={attachedPhotos}
        removeItem={index =>
          setAttachedPhotos(actual =>
            actual?.filter((_, _index) => index !== _index),
          )
        }
      />
      <SendMessageChatArea
        {...{
          setTextMessage,
          textMessage,
          attachPhotos,
          setAttachedPhotos,
          attachedPhotos,
        }}
      />
    </LayoutView>
  );
};

export default observer(ChatScreen);
