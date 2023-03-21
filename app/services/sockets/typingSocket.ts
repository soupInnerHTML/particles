import {Socket} from './index';

enum TypingSocketEvents {
  subscribe = 'subscribe',
  typing = 'typing',
  type = 'type',
}

class TypingSocket extends Socket {
  protected _instance = this._createInstance('/typing');

  type(id: string, typing: boolean) {
    this._instance.emit(TypingSocketEvents.type, {id, typing});
  }

  typingListener(id: string, callback: (...args: any[]) => void) {
    this._instance.emit(TypingSocketEvents.subscribe, id);
    this._instance.on('typing', callback);

    return () => {
      this._instance.off('typing', callback);
    };
  }

  constructor() {
    super();
  }
}

export const typingSocket = new TypingSocket();
