// import {hydrate} from './persist/hydrate';
import {computed, makeAutoObservable, makeObservable, observable} from 'mobx';
import {IUserModel} from './UserModel';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import ModelWithStatus from './abstract/ModelWithStatus';

export interface IAuth {
  email: string;
  password: string;
}

// @hydrate
class AccountModel extends ModelWithStatus implements IMaybe<IUserModel> {
  @observable public id?: string;
  @observable public email?: string;
  @observable public avatar?: string;
  @observable public name?: string;
  @observable public postsOwner?: string[];

  @computed public get isAuthenticated(): boolean {
    return Boolean(this.id);
  }

  public signUp = async (params: IAuth) => {
    const user = await this._tryAuth(() =>
      auth().createUserWithEmailAndPassword(params.email, params.password),
    );
    console.log(user);
  };

  public signIn = async (params: IAuth) => {
    const user = await this._tryAuth(() =>
      auth().signInWithEmailAndPassword(params.email, params.password),
    );
  };

  private async _tryAuth(method: () => void) {
    try {
      this.setStatus('PENDING');
      return await method();
    } catch (e: any) {
      Alert.alert(e.toString().replace(/Error: \[.+\]/g, ''));
    } finally {
      this.setStatus('DONE');
    }
  }

  public async signOut() {
    await auth().signOut();
  }

  private _onAuthStateChanged = (user: Maybe<FirebaseAuthTypes.User>) => {
    this.id = user?.uid;
    this.email = user?.email!;
    this.name = user?.displayName!;
    this.avatar = user?.photoURL!;

    console.log(this);
  };

  constructor() {
    super();
    makeObservable(this);
    auth().onAuthStateChanged(this._onAuthStateChanged);
  }
}

export default new AccountModel();
