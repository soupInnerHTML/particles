import {Socket} from './index';

enum OnlineSocketEvents {
  awaking = 'awaking',
  online = 'online',
  subscribe = 'subscribe',
}

class OnlineSocket extends Socket {
  protected _instance = this._createInstance('/online');
  awaking(id: string) {
    this.connect();
    this._instance.emit(OnlineSocketEvents.awaking, {id});
    return () => {
      this.disconnect();
    };
  }
  onlineListener(id: string, callback: (...args: any[]) => void) {
    this._instance.emit(OnlineSocketEvents.subscribe, id);
    this._instance.on(OnlineSocketEvents.online, callback);

    return () => {
      this._instance.off(OnlineSocketEvents.online, callback);
    };
  }

  constructor() {
    super();
  }
}

export const onlineSocket = new OnlineSocket();
