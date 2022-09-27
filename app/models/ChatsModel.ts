import FirestoreModel from './abstract/FirestoreModel';
import {makeObservable, override, when} from 'mobx';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import AccountModel from './AccountModel';
import AuthModel from './AuthModel';
// import DocumentReference = FirebaseFirestoreTypes.DocumentReference;

export interface IChat {
  members: FirebaseFirestoreTypes.DocumentReference[];
  messageHistory: IMessage[];
  changed: number;
  id: string;
}

export interface IMessage {
  text: string;
  time: FirebaseFirestoreTypes.Timestamp;
  status: MessageStatus;
  author?: FirebaseFirestoreTypes.DocumentReference;
}

export enum MessageStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

class ChatsModel extends FirestoreModel<IChat> {
  // override _orderBy = {
  //   fieldPath: 'changed',
  //   directionStr: 'desc',
  // };
  @override
  protected get _filteredInstance() {
    const {id} = AccountModel;
    const ref = firestore().collection('users').doc(id);

    console.log(ref.id);
    return (
      this._instance
        // .where('members', 'array-contains', ref)
        .orderBy('changed', 'desc')
    );
  }
  async sendMessage(to: string, message: string) {
    const target = this.data.find(chat => chat.id === to)!;
    const now = firestore.Timestamp.now();
    firestore()
      .collection('users')
      .doc(AccountModel.id)
      .update({lastSeen: now});
    await firestore()
      .collection('chats')
      .doc(to)
      .update({
        changed: now,
        messageHistory: [
          ...target.messageHistory,
          {
            author: firestore().collection('users').doc(AccountModel.id!),
            status: 'UNREAD',
            text: message,
            time: now,
          },
        ],
      });
  }
  constructor() {
    super();
    makeObservable(this);
    when(
      () => AuthModel.isAuthenticated,
      () => this.getData(),
    );
  }
}

export default new ChatsModel();
