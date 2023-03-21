import {useKeyboard} from '@react-native-community/hooks';
import {useEffect} from 'react';
import AccountModel from '@models/mobx/AccountModel';
import {typingSocket} from '../services/sockets/typingSocket';

function type(typing: boolean) {
  typingSocket.type(AccountModel.id!, typing);
}

export function useTyping(textMessage: string | undefined) {
  const {keyboardShown} = useKeyboard();

  useEffect(() => {
    if (AccountModel.id) {
      if (textMessage && keyboardShown) {
        type(true);
      } else {
        type(false);
      }
    }
  }, [AccountModel.id, keyboardShown, textMessage]);
}
