// import {hydrate} from './persist/hydrate';
import {action, computed, makeObservable, observable} from 'mobx';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import ModelWithStatus from '../abstract/ModelWithStatus';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {showFirebaseError, showSuccess} from '../../utils/messages';
import AccountModel, {IUserModel} from './AccountModel';
import firestore from '@react-native-firebase/firestore';

export interface IAuth {
  email: string;
  password: string;
}

export type ISignUp = IAuth & {
  name: string;
};

enum ESignInMethods {
  NONE,
  SIMPLE,
  GOOGLE,
}

// @hydrate
class AuthModel extends ModelWithStatus {
  @observable public signMethod = ESignInMethods.NONE;

  @computed public get isGoogleSignIn() {
    return this.signMethod === ESignInMethods.GOOGLE;
  }
  @computed public get isSimpleSignIn() {
    return this.signMethod === ESignInMethods.SIMPLE;
  }

  @computed public get isAuthenticated(): boolean {
    return Boolean(AccountModel.id);
  }

  @action public signUp = async (params: ISignUp) => {
    this.signMethod = ESignInMethods.SIMPLE;
    const credential = await this._tryAuth(() =>
      auth().createUserWithEmailAndPassword(params.email, params.password),
    );
    AccountModel.name = params.name;

    if (credential) {
      await AuthModel._duplicateUserToFirestore({
        name: AccountModel.name,
        avatar: AccountModel.avatar || AccountModel.avatarPlaceholder,
        email: AccountModel.email!,
        id: AccountModel.id!,
        lastSeen: firestore.Timestamp.now(),
      });
    }
  };

  public signIn = async (params: IAuth) => {
    this.signMethod = ESignInMethods.SIMPLE;
    return await this._tryAuth(() =>
      auth().signInWithEmailAndPassword(params.email, params.password),
    );
  };

  private static async _duplicateUserToFirestore({id, ...user}: IUserModel) {
    await firestore()
      .collection<Omit<IUserModel, 'id'>>('users')
      .doc(id)
      .set(user);
  }

  public googleSignIn = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const {user} =
      (await this._tryAuth(
        () => auth().signInWithCredential(googleCredential),
        ESignInMethods.GOOGLE,
      )) || {};

    user &&
      (await AuthModel._duplicateUserToFirestore({
        email: user.email!,
        name: user.displayName!,
        lastSeen: firestore.Timestamp.now(),
        id: user.uid,
        avatar: user.photoURL!,
        color: 'red',
      }));
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
      showFirebaseError(e);
    } finally {
      this.setStatus('DONE');
      this.signMethod = ESignInMethods.NONE;
    }
  }

  public async signOut() {
    await auth().signOut();
    AccountModel.id = undefined;
  }

  // private _onAuthStateChanged = (user: Maybe<FirebaseAuthTypes.User>) => {
  //   this.id = user?.uid;
  //   this.email = user?.email!;
  //   this.name = user?.displayName!;
  //   this.avatar = user?.photoURL!;
  //
  //   console.log(this);
  // };

  sendPasswordResetEmail = async (params: IAuth) => {
    try {
      this.setStatus('PENDING');
      await auth().sendPasswordResetEmail(params.email);
      showSuccess({message: 'Email was sent on your address'});
    } catch (e: any) {
      showFirebaseError(e);
    } finally {
      this.setStatus('DONE');
    }
  };

  @action.bound private _onUserChanged(user: Maybe<FirebaseAuthTypes.User>) {
    AccountModel.id = user?.uid;
    AccountModel.email = user?.email!;
    AccountModel.name = user?.displayName!;
    AccountModel.avatar = user?.photoURL!;

    // console.log(this);
  }

  constructor() {
    super();
    makeObservable(this);
    // auth().onAuthStateChanged(this._onUserChanged);
    auth().onUserChanged(this._onUserChanged);
  }
}

export default new AuthModel();
