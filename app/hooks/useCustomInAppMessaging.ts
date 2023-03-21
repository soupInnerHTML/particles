import {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {IMessage} from '@models/mobx/ChatsModel';
import {showMessage} from 'react-native-flash-message';
import {NotificationAvatar} from '@atoms/NotificationAvatar';
import AccountModel from '@models/mobx/AccountModel';
import useAppNavigation from '@hooks/useAppNavigation';
import getIdAlphabetically from '@utils/getIdAlphabetically';

export default function (chatId: string) {
  const navigation = useAppNavigation();
  useEffect(() => {
    if (!+chatId) {
      return firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messageHistory')
        .orderBy('time', 'asc')
        .onSnapshot(snapshot => {
          if (snapshot) {
            snapshot.docChanges().forEach(async item => {
              if (item.doc.exists) {
                switch (item.type) {
                  case 'added':
                    const message = item.doc.data() as IMessage;
                    if (message.author?.id !== AccountModel.id) {
                      const user = await message.author?.get();
                      const userData = user.data();
                      showMessage({
                        type: 'default',
                        message: userData.name,
                        description: message.text,
                        duration: 5000,
                        icon: NotificationAvatar.bind(1, {
                          uri: userData.avatar,
                        }),
                        onPress: () =>
                          navigation.navigate('Chat', {
                            id: getIdAlphabetically(user.id, AccountModel.id),
                            userId: user.id,
                          }),
                      });
                    }
                }
              }
            });
          }
        });
    }
  }, [chatId]);
}
