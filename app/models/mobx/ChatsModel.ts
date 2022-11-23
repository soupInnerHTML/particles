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
import Clipboard from '@react-native-clipboard/clipboard';
import {showSuccess} from '@utils/messages';
import {Alert} from 'react-native';

// import DocumentReference = FirebaseFirestoreTypes.DocumentReference;

export interface IChat {
  members: FirebaseFirestoreTypes.DocumentReference<IUserModel>[];
  changed: number;
  id: string;
}

interface IMessageMeta {
  time: FirebaseFirestoreTypes.Timestamp;
  status: MessageStatus;
  author?: FirebaseFirestoreTypes.DocumentReference;
  edited: boolean;
}

export interface IMessagePayload {
  text?: string;
  photos?: Asset[];
  videos?: Asset[];
}

export type IMessage = IWithId<IMessageMeta & IMessagePayload>;

export enum MessageStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

@hydrate
class ChatsModel extends FirestoreModel<IChat> {
  @persist @computed get lastChatsCount() {
    return this.data.length || 3;
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
  sendPushNotification(
    fcmToken: string,
    chat: string,
    message: IMessagePayload,
  ) {
    const myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      'key=AAAAbM1jd3I:APA91bHh2SghisAEe9dRiVjHHn9lHbV7TX0Gd0XxokedKFXSzyFcNb7Aw_V1OlYirYPnO5mGXPvwjqRubjG3vieSqeVqlZKpDN9Ol5QKIsGIDuYSfkyLE6NJB6Xn7-RdmhDawTU6HBWb',
    );
    myHeaders.append('Content-Type', 'application/json');

    // console.log(AccountModel);

    const raw = JSON.stringify({
      data: {
        avatar: AccountModel.avatar || AccountModel.avatarPlaceholder,
        chat,
        userId: AccountModel.name,
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
      .then(result =>
        console.log('https://fcm.googleapis.com/fcm/send', result),
      )
      .catch(error =>
        console.log('https://fcm.googleapis.com/fcm/send error', error),
      );
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
      .collection('messageHistory')
      .add({
        author: firestore().collection('users').doc(AccountModel.id!),
        status: 'UNREAD',
        text: message.text?.trim() ?? null,
        photos: message.photos?.map(asset => asset.base64) ?? null,
        time: now,
      });

    const companionRef = target.members.find(
      user => user.id != AccountModel.id,
    );
    const companion = await companionRef?.get();

    this.sendPushNotification(
      companion?.data()?.fcmToken || '',
      target.id,
      message,
    );
  }
  getMessage(chatId: string, messageId: string) {
    return this._instance
      .doc(chatId)
      .collection('messageHistory')
      .doc(messageId);
  }
  async readMessages(chatId: string, ...messageIds: string[]) {
    messageIds.forEach(messageId => {
      this.getMessage(chatId, messageId).update({
        status: MessageStatus.READ,
      });
    });
  }
  deleteMessage(chatId: string, messageId: string) {
    return this.getMessage(chatId, messageId).delete();
  }
  editMessage(
    defaultText: string | undefined,
    chatId: string,
    messageId: string,
  ) {
    Alert.prompt(
      'Edit message',
      '',
      text =>
        this.getMessage(chatId, messageId).update({
          text,
          edited: true,
        }),
      'plain-text',
      defaultText,
    );
  }
  copyMessage(content?: string) {
    content && Clipboard.setString(content);
    showSuccess({message: 'Media data copied'});
  }
  constructor() {
    super();
    makeObservable(this);
    when(
      () => AuthModel.isAuthenticated,
      () => this._filteredInstance.onSnapshot(this._onSnapshot, this._onError),
      {name: 'when'},
    );
  }
}

export default new ChatsModel();
