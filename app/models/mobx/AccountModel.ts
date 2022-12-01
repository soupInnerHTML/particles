import {action, computed, makeObservable, observable, reaction} from 'mobx';
import ModelWithStatus from '../abstract/ModelWithStatus';
import generateAvatarPlaceholder from '../../utils/generateAvatarPlaceholder';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

export interface IUserModelWithoutId {
  name: string;
  shortName: string;
  email: string;
  avatar?: string;
  avatarPlaceholder: string;
  lastSeen: FirebaseFirestoreTypes.Timestamp;
  theme: Theme;
  fcmToken: string;
  about?: string;
}

enum Theme {
  'dark' = 'dark',
  'light' = 'light',
}

export type IUserModel = IWithId<IUserModelWithoutId>;

class AccountModel extends ModelWithStatus implements IMaybe<IUserModel> {
  @observable public id?: string;
  @observable public email?: string;
  @observable public avatar?: string;
  @observable public name?: string;
  @observable public theme = Theme.dark;
  @observable public lastSeen?: FirebaseFirestoreTypes.Timestamp;
  @observable private _color?: string;
  @observable public fcmToken?: string;
  @observable public shortName?: string;

  @computed public get avatarPlaceholder() {
    return generateAvatarPlaceholder(this.name, this._color);
  }
  @computed public get ref() {
    if (this.id) {
      return firestore().collection<IUserModel>('users').doc(this.id);
    } else {
      return null;
    }
  }

  @action.bound setTheme(theme: keyof typeof Theme) {
    this.theme = Theme[theme];
    this.ref?.update({
      theme: this.theme,
    });
  }

  @action.bound updateFcmToken(fcmToken: string) {
    firestore().collection('users').doc(this.id).update({
      fcmToken,
    });
  }

  constructor() {
    super();
    makeObservable(this);

    reaction(
      () => this.ref,
      ref => {
        if (ref) {
          ref.onSnapshot(snapshot => {
            const user = snapshot.data();

            if (user) {
              this.name = user.name;
              this.avatar = user.avatar;
              this.email = user.email;
              this.theme = user.theme;
              this.shortName = user.shortName;
            }
          });
        }
      },
    );
  }
}

export default new AccountModel();
