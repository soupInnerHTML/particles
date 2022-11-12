import FirestoreModel from '../abstract/FirestoreModel';
import {computed, makeObservable, override, when} from 'mobx';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import AccountModel, {IUserModel} from './AccountModel';
import AuthModel from './AuthModel';
import {Asset} from 'react-native-image-picker';
import {persist} from 'mobx-persist';
import {hydrate} from '@models/persist/hydrate';

// import DocumentReference = FirebaseFirestoreTypes.DocumentReference;

export interface IChat {
  members: FirebaseFirestoreTypes.DocumentReference<IUserModel>[];
  messageHistory: IMessage[];
  changed: number;
  id: string;
}

interface IMessageMeta {
  time: FirebaseFirestoreTypes.Timestamp;
  status: MessageStatus;
  author?: FirebaseFirestoreTypes.DocumentReference;
}

export interface IMessagePayload {
  text?: string;
  photos?: Asset[];
  videos?: Asset[];
}

export type IMessage = IMessageMeta & IMessagePayload;

export enum MessageStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

@hydrate
class ChatsModel extends FirestoreModel<IChat> {
  @persist @computed get lastChatsCount() {
    return this.data.length;
  }
  @computed get placeholder(): IChat[] {
    //TODO: refactor placeholder
    // @ts-ignore
    return Array.from(
      {
        length: this.lastChatsCount,
      },
      (_, index) => ({
        members: [{}, {}],
        id: index,
        changed: index,
        messageHistory: [{}],
      }),
    );
  }
  @override
  protected get _filteredInstance() {
    const {id} = AccountModel;
    const ref = firestore().collection('users').doc(id);

    console.log(ref.id);
    return this._instance
      .where('members', 'array-contains', ref)
      .orderBy('changed', 'desc');
  }
  findChat(chatId: string) {
    return this.data.find(chat => chat.id === chatId)!;
  }
  sendPushNotification(fcmToken: string, message: IMessagePayload) {
    const myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      'key=AAAAbM1jd3I:APA91bHh2SghisAEe9dRiVjHHn9lHbV7TX0Gd0XxokedKFXSzyFcNb7Aw_V1OlYirYPnO5mGXPvwjqRubjG3vieSqeVqlZKpDN9Ol5QKIsGIDuYSfkyLE6NJB6Xn7-RdmhDawTU6HBWb',
    );
    myHeaders.append('Content-Type', 'application/json');

    console.log(AccountModel);

    const raw = JSON.stringify({
      data: {
        avatar: AccountModel.avatar || AccountModel.avatarPlaceholder,
      },
      notification: {
        title: AccountModel.name,
        body: message.text,
      },
      to: fcmToken,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }
  async sendMessage(to: string, message: IMessagePayload) {
    const target = this.findChat(to);
    const now = firestore.Timestamp.now();
    // firestore()
    //   .collection('users')
    //   .doc(AccountModel.id)
    //   .update({lastSeen: now});
    await firestore()
      .collection('chats')
      .doc(to)
      .update({
        changed: now,
        messageHistory: [
          {
            author: firestore().collection('users').doc(AccountModel.id!),
            status: 'UNREAD',
            text: message.text?.trim() ?? null,
            photos: message.photos?.map(asset => asset.base64) ?? null,
            time: now,
          },
          ...target.messageHistory,
        ],
      });

    this.sendPushNotification(
      'cbtsw62uS1K3MIdZkAQgkl:APA91bFo7McbrUmOKDN17qKVqLbf8AXP3SX_wgVKwcTQZsKV6NzgRLgA_S-fOZN8iSc-gTEPfPmHufO-fgSV5jh0q_B6_hjJLdqwVfDJTRMSqR-kOslPXjJIC8E1tvBJjlq6UwZbLhci',
      message,
    );
  }
  readMessages(chatId: string) {
    this._instance.doc(chatId).update({
      messageHistory: this.findChat(chatId).messageHistory.map(message =>
        message.author?.id !== AccountModel.id
          ? {...message, status: MessageStatus.READ}
          : message,
      ),
    });
  }
  deleteMessage(chatId: string, messageIndex: number) {}
  constructor() {
    super();
    makeObservable(this);
    when(
      () => AuthModel.isAuthenticated,
      () => this._filteredInstance.onSnapshot(this._onSnapshot, this._onError),
    );
  }
}

export default new ChatsModel();
