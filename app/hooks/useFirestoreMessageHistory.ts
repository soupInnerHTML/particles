import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {IMessage} from '@models/mobx/ChatsModel';

export default function (chatId: string): Maybe<IMessage[]> {
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);
  useEffect(() => {
    if (!+chatId) {
      return firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messageHistory')
        .orderBy('time', 'asc')
        .onSnapshot(snapshot => {
          if (snapshot) {
            if (messageHistory.length) {
              snapshot.docChanges().forEach(item => {
                if (item.doc.exists) {
                  switch (item.type) {
                    case 'added':
                      return setMessageHistory(actual => {
                        return [
                          <IMessage>{...item.doc.data(), id: item.doc.id},
                          ...actual,
                        ];
                      });
                    case 'removed':
                      return setMessageHistory(actual =>
                        actual.filter(m => m.id !== item.doc.id),
                      );
                    case 'modified':
                      return setMessageHistory(actual =>
                        actual.map(m =>
                          m.id === item.doc.id ? <IMessage>item.doc.data() : m,
                        ),
                      );
                  }
                }
              });
            } else {
              const items: IMessage[] = [];
              snapshot.forEach(item => {
                item.exists && items.unshift(item.data());
              });

              setMessageHistory(items);
            }
          }
        });
    }
  }, [chatId]);

  return messageHistory;
}
