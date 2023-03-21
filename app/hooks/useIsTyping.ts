import {useEffect, useState} from 'react';
import {typingSocket} from '../services/sockets/typingSocket';

export function useIsTyping(id: string | undefined) {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (id) {
      const cleanup = typingSocket.typingListener(id, e => {
        if (e.id === id) {
          setIsTyping(e.typing);
        }
      });

      return () => cleanup();
    }
  }, [id]);

  return isTyping;
}
