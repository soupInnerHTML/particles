import FirestoreModel from '../abstract/FirestoreModel';
import {makeObservable, override, when} from 'mobx';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AccountModel, {IUserModel} from './AccountModel';
import AuthModel from './AuthModel';
import {Asset} from 'react-native-image-picker';
import Clipboard from '@react-native-clipboard/clipboard';
import {showError, showSuccess} from '@utils/messages';
import {Alert} from 'react-native';
import {EStatus} from '@models/abstract/ModelWithStatus';

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
  photos?: string[]; //urls
  videos?: string[]; //urls
}

export type IMessage = IWithId<IMessageMeta & IMessagePayload>;

export enum MessageStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

class ChatsModel extends FirestoreModel<IChat> {
  @override status: EStatus = EStatus.PENDING;
  @override
  protected get _filteredInstance() {
    return this._instance
      .where('members', 'array-contains', AccountModel.ref)
      .orderBy('changed', 'desc');
  }
  findChat(chatId: string) {
    return this.data.find(chat => chat.id === chatId);
  }
  async deleteChat(chatId: string) {
    const target = firestore().collection('chats').doc(chatId);
    const messageHistoryRef = await target.collection('messageHistory').get();

    messageHistoryRef.forEach(doc => doc.ref.delete());
    await target.delete();

    const storageRef = storage().ref(chatId);

    return storageRef.listAll().then(dir => {
      dir.prefixes.forEach(folderRef =>
        folderRef
          .listAll()
          .then(nested => nested.items.forEach(item => item.delete())),
      );
    });
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
  async sendMessage(
    chatId: string,
    companionId: string,
    message: IMessagePayload,
  ) {
    const target = this.findChat(chatId);
    const now = firestore.Timestamp.now();

    const chatRef = firestore().collection<IChat>('chats').doc(chatId);

    const companionRef =
      target?.members.find(user => user.id === companionId) ??
      firestore().collection<IUserModel>('users').doc(companionId);

    const companion = await companionRef?.get();

    // @ts-ignore
    chatRef.set({
      members: [AccountModel.ref!, companionRef!],
      changed: now,
    });

    const photos = message.photos
      ? await this.uploadAssetsToStorage(message.photos, chatId)
      : null;

    await chatRef.collection('messageHistory').add({
      author: AccountModel.ref,
      status: AccountModel.ref?.isEqual(companionRef)
        ? MessageStatus.READ
        : MessageStatus.UNREAD,
      text: message.text?.trim() ?? null,
      photos,
      time: now,
    });

    this.sendPushNotification(
      companion?.data()?.fcmToken || '',
      chatId,
      message,
    );
  }
  async uploadAssetsToStorage(assets: Asset[], chatId: string) {
    const urls: string[] = [];

    for (let asset of assets) {
      const ref = storage().ref(
        `/${chatId}/${AccountModel.id}/${asset.fileName}`,
      );
      if (asset.uri) {
        const task = ref.putFile(asset.uri);
        await new Promise(resolve =>
          task.then(async () => {
            const url = await ref.getDownloadURL();
            urls.push(url);
            resolve(true);
          }),
        );
      } else if (asset.base64) {
        const task = ref.putString(asset.base64, 'base64', {
          contentType: asset.type,
        });
        await new Promise(resolve =>
          task.then(async () => {
            const url = await ref.getDownloadURL();
            urls.push(url);
            resolve(true);
          }),
        );
      } else {
        showError({message: 'Unable to load file to the storage'});
      }
    }

    return urls;
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
  async deleteMessage(chatId: string, messageId: string) {
    const targetRef = this.getMessage(chatId, messageId);
    const target = await targetRef.get();
    await targetRef.delete();
    const data = target.data() as IMessage;
    data.photos?.forEach(photo => {
      storage().refFromURL(photo).delete();
    });
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
      {name: 'subscribeToChatsUpdateAfterAuthReaction'},
    );
  }
}

export default new ChatsModel();
