import StatusModel from '@models/abstract/StatusModel';
import {
  action,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
} from 'mobx';
import {debounce} from 'lodash';
import {IChat} from '@models/mobx/ChatsModel';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import AccountModel, {IUserModel} from '@models/mobx/AccountModel';
import getIdAlphabetically from '@utils/getIdAlphabetically';

class SearchChatsModel extends StatusModel {
  @observable data: IChat[] = [];
  @observable searchQuery: string = '';

  @action.bound setSearchQuery(query: string) {
    this.searchQuery = query;
  }
  private _containsSearchPath(str: string, ignore?: string[]) {
    return str.toLowerCase().startsWith(
      this.searchQuery
        .toLowerCase()
        .replace(ignore ? new RegExp(`[${ignore.join('\\')}]`, 'g') : '', ' ')
        .trim(),
    );
  }
  @action.bound async searchChats() {
    console.log('search');
    // this.setStatus('PENDING');
    const prepare: IChat[] = [];
    const promises: Promise<IChat | void>[] = [];
    const snapshot = await firestore()
      .collection<IUserModel>('users')
      .orderBy('name')
      // .startAt(this.searchPath)
      // .endAt(this.searchPath + '\uf8ff')
      // .where('name', '==', this.searchPath)
      .get();

    // The character \uf8ff used in the query is after most regular characters in Unicode,
    // therefore the query matches all values that start with searchPath.

    snapshot.forEach(item => {
      if (item.exists) {
        const data = item.data();
        if (
          this._containsSearchPath(data.name, ['_', '-', '.']) ||
          this._containsSearchPath(data.shortName, ['@'])
        ) {
          promises.push(
            this.imitateChatByUserRef(item.ref)
              .then(chat => {
                prepare.push(chat);
              })
              .catch(() => this.setStatus('ERROR')),
          );
        }
      }
    });

    Promise.all(promises)
      .then(() => {
        this.data = prepare;
        this.setStatus('DONE');
      })
      .catch(() => this.setStatus('ERROR'));
  }
  async imitateChatByUserRef(
    userRef: FirebaseFirestoreTypes.DocumentReference<IUserModel>,
  ): Promise<IChat> {
    const me = await AccountModel.ref!.get();
    return {
      changed: firestore.Timestamp.now().seconds,
      members: [me.ref, userRef],
      id: getIdAlphabetically(me.ref.id, userRef.id),
    };
  }

  private _DEBOUNCE_SEARCH_CHATS_TIMING = 250;

  private _searchReaction(): IReactionDisposer {
    return reaction(
      () => this.searchQuery,
      () => {
        this.setPendingStatus();
        this.data = [];
        debounce(this.searchChats, this._DEBOUNCE_SEARCH_CHATS_TIMING)();
      },
    );
  }

  constructor() {
    super();
    makeObservable(this);
    this._searchReaction();
  }
}

export default new SearchChatsModel();
