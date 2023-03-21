import {
  ManagerOptions,
  SocketOptions,
  Socket as ISocket,
  io,
} from 'socket.io-client';

export abstract class Socket {
  private _baseUri = 'http://localhost:5001';

  protected _createInstance(path: string) {
    return io(this._baseUri + path, this._options);
  }
  protected _options: Partial<ManagerOptions & SocketOptions> = {
    autoConnect: true,
    transports: ['websocket'],
  };
  protected abstract _instance: ISocket;
  connect() {
    if (this._instance.disconnected) {
      this._instance.connect();
    }
  }
  disconnect() {
    if (this._instance.connected) {
      this._instance.disconnect();
      // console.log('disconnect');
    }
  }
}
