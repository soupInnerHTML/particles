import firestore from '@react-native-firebase/firestore';
import {IUserModel} from './AccountModel';
import {hydrate} from '../persist/hydrate';
import {persist} from 'mobx-persist';
import {makeAutoObservable, when} from 'mobx';

@hydrate
class UsersModel {
  private get _instance() {
    return firestore().collection<IUserModel>('users');
  }

  @persist('list') cached: string[] = [];
  data: IUserModel[] = [];

  async getUser(id: string) {
    const knownUser = this.data.find(user => user.id === id);
    if (knownUser) {
      return knownUser;
    } else {
      const user = await this._instance.doc(id).get();
      const email = user.data()?.email!;
      if (!this.cached.includes(email)) {
        this.cached.push(email);
      }
      return user;
    }
  }

  constructor() {
    makeAutoObservable(this);

    when(
      () => !!this.cached.length,
      () => {
        this._instance
          .where('email', 'in', this.cached)
          .onSnapshot(async snapshot => {
            this.data = [];
            snapshot.forEach(result => {
              this.data.push({...result.data(), id: result.id});
            });

            console.log(this.data);
          });
      },
    );
  }
}

export default new UsersModel();
