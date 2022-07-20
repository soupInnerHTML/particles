// import {hydrate} from './persist/hydrate';
import {computed, makeObservable, observable} from 'mobx';
import {IUserModel} from './UserModel';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import ModelWithStatus from './abstract/ModelWithStatus';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import alert from '../utils/alert';
import parseFirebaseError from '../utils/parseFirebaseError/parseFirebaseError';

export interface IAuth {
  email: string;
  password: string;
}

enum ESignInMethods {
  NONE,
  SIMPLE,
  GOOGLE,
}

// @hydrate
class AccountModel extends ModelWithStatus implements IMaybe<IUserModel> {
  @observable public id?: string;
  @observable public email?: string;
  @observable public avatar?: string;
  @observable public name?: string;
  @observable public postsOwner?: string[];
  @observable public signMethod = ESignInMethods.NONE;

  @computed public get isGoogleSignIn() {
    return this.signMethod === ESignInMethods.GOOGLE;
  }
  @computed public get isSimpleSignIn() {
    return this.signMethod === ESignInMethods.SIMPLE;
  }

  @computed public get isAuthenticated(): boolean {
    return Boolean(this.id);
  }

  public signUp = async (params: IAuth) => {
    this.signMethod = ESignInMethods.SIMPLE;
    const user = await this._tryAuth(() =>
      auth().createUserWithEmailAndPassword(params.email, params.password),
    );
    console.log(user);
  };

  public signIn = async (params: IAuth) => {
    this.signMethod = ESignInMethods.SIMPLE;
    const user = await this._tryAuth(() =>
      auth().signInWithEmailAndPassword(params.email, params.password),
    );
  };

  public googleSignIn = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    await this._tryAuth(
      () => auth().signInWithCredential(googleCredential),
      ESignInMethods.GOOGLE,
    );
  };

  public githubSignIn = async () => {
    const provider = auth.GithubAuthProvider.credential(
      '467302315890-rjojkpn1elfp9i4oet8bif2ja0nt1e31.apps.googleusercontent.com',
      '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',
    );

    console.log(provider.token);
  };

  private async _tryAuth(
    callback: () => Promise<FirebaseAuthTypes.UserCredential>,
    method = ESignInMethods.SIMPLE,
  ) {
    try {
      this.signMethod = method;
      this.setStatus('PENDING');
      return await callback();
    } catch (e: any) {
      alert(parseFirebaseError(e));
    } finally {
      this.setStatus('DONE');
      this.signMethod = ESignInMethods.NONE;
    }
  }

  public async signOut() {
    await auth().signOut();
    this.id = undefined;
  }

  private _onAuthStateChanged = (user: Maybe<FirebaseAuthTypes.User>) => {
    this.id = user?.uid;
    this.email = user?.email!;
    this.name = user?.displayName!;
    this.avatar = user?.photoURL!;

    console.log(this);
  };

  sendPasswordResetEmail = async (params: IAuth) => {
    try {
      this.setStatus('PENDING');
      await auth().sendPasswordResetEmail(params.email);
      alert('Email was sent on your address');
    } catch (e: any) {
      alert(parseFirebaseError(e));
    } finally {
      this.setStatus('DONE');
    }
  };

  constructor() {
    super();
    makeObservable(this);
    auth().onAuthStateChanged(this._onAuthStateChanged);
  }
}

export default new AccountModel();
