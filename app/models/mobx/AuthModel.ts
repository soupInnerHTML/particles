import {action, computed, makeObservable, observable} from 'mobx';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import ModelWithStatus from '../abstract/ModelWithStatus';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {showFirebaseError, showSuccess} from '@utils/messages';
import AccountModel, {IUserModelServer} from './AccountModel';
import firestore from '@react-native-firebase/firestore';
import generateRandomColor from '@utils/generateRandomColor';

export interface IAuth {
  email: string;
  password: string;
}

export type ISignUp = IAuth & {
  name: string;
  shortName: string;
};

enum ESignInMethods {
  NONE,
  SIMPLE,
  GOOGLE,
}

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

    if (credential) {
      await this._duplicateUserToFirestore({
        name: params.name,
        avatar: '',
        email: params.email,
        id: credential.user.uid,
        lastSeen: firestore.Timestamp.now(),
        shortName: params.shortName,
        color: generateRandomColor(),
      });
    }
  };

  public signIn = async (params: IAuth) => {
    this.signMethod = ESignInMethods.SIMPLE;
    return await this._tryAuth(() =>
      auth().signInWithEmailAndPassword(params.email, params.password),
    );
  };

  private async _duplicateUserToFirestore({
    id,
    ...user
  }: IWithId<IUserModelServer>) {
    const ref = firestore().collection<IUserModelServer>('users').doc(id);
    const _user = await ref.get();
    if (_user.exists) {
      await ref.update(user);
    } else {
      await ref.set(user);
    }
  }

  public googleSignIn = async () => {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    console.log(idToken);

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const {user} =
      (await this._tryAuth(
        () => auth().signInWithCredential(googleCredential),
        ESignInMethods.GOOGLE,
      )) || {};

    user &&
      (await this._duplicateUserToFirestore({
        email: user.email!,
        name: user.displayName!,
        lastSeen: firestore.Timestamp.now(),
        id: user.uid,
        avatar: user.photoURL!,
      }));
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

  public signOut() {
    return auth().signOut();
  }

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
  }

  constructor() {
    super();
    makeObservable(this);
    auth().onUserChanged(this._onUserChanged);
  }
}

export default new AuthModel();
