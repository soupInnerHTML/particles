import {useEffect} from 'react';
import {onlineSocket} from '../services/sockets/onlineSocket';
import {useAppState} from '@react-native-community/hooks';

export default function (userId?: string) {
  const currentAppState = useAppState();
  useEffect(() => {
    if (currentAppState === 'active') {
      userId && onlineSocket.awaking(userId);
    } else {
      onlineSocket.disconnect();
    }
  }, [currentAppState]);
  useEffect(() => {
    if (userId) {
      const cleanup = onlineSocket.awaking(userId);
      return () => cleanup();
    }
  }, [userId]);
}
