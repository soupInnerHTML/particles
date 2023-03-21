import {useEffect, useState} from 'react';
import {onlineSocket} from '../services/sockets/onlineSocket';
// import {Alert} from 'react-native';

export default function (id: string | undefined) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (id) {
      const cleanup = onlineSocket.onlineListener(id, e => {
        // Alert.alert(JSON.stringify(e));
        if (e.id === id) {
          setIsOnline(e.online);
        }
      });

      return () => cleanup();
    }
  }, [id]);

  return isOnline;
}
