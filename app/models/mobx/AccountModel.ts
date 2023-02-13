import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
} from 'mobx';
import StatusModel from '../abstract/StatusModel';
import generateAvatarPlaceholder from '../../utils/generateAvatarPlaceholder';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {noop} from 'lodash';
import {showError} from '@utils/messages';
import {Platform} from 'react-native';

export interface IUserModelServer {
  name: string;
  shortName?: string;
  email: string;
  avatar?: string;
  lastSeen: FirebaseFirestoreTypes.Timestamp;
  theme?: Theme;
  fcmToken?: string;
  bio?: string;
  color?: string;
}

export type IUserModelWithoutId = Omit<IUserModelServer, 'color'> & {
  avatarPlaceholder: string;
  notificationsEnabled: boolean;
  ref: AccountRef;
};

type AccountRef = Maybe<
  FirebaseFirestoreTypes.DocumentReference<IUserModelServer>
>;

export enum Theme {
  'dark' = 'dark',
  'light' = 'light',
}

export type IUserModel = IWithId<IUserModelWithoutId>;

interface IAccountModel extends IMaybe<IUserModel> {}

class AccountModel extends StatusModel implements IAccountModel {
  @observable public id?: string;
  @observable public email?: string;
  @observable public avatar?: string;
  @observable public name?: string;
  @observable public theme = Theme.dark;
  @observable public notificationsEnabled = Platform.OS === 'android';
  @observable public lastSeen?: FirebaseFirestoreTypes.Timestamp;
  @observable private _color?: string;
  @observable public fcmToken?: string;
  @observable public shortName?: string;
  @observable public bio?: string;

  @computed public get avatarPlaceholder() {
    return generateAvatarPlaceholder(this.name, 'ff0000');
  }

  private _unsubRef: () => void = noop;
  @computed public get ref() {
    if (this.id) {
      return firestore().collection<IUserModelServer>('users').doc(this.id);
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
  @action.bound setNotificationsEnabled(notificationsEnabled: boolean) {
    this.notificationsEnabled = notificationsEnabled;
  }

  @action.bound updateFcmToken(fcmToken: string) {
    return this.updateData({fcmToken});
  }

  @action.bound updateData(data: Partial<IUserModelServer>) {
    return this.ref?.update(data);
  }

  @action.bound checkShortName(callback: (...a: any[]) => unknown) {
    return async (data: IMaybe<IUserModelServer>) => {
      if (data.shortName === this.shortName) {
        return callback(data);
      }
      const matches = await firestore()
        .collection<IUserModelServer>('users')
        .where('shortName', '==', data.shortName)
        .get();

      if (matches.empty) {
        callback(data);
      } else {
        showError({message: 'Nickname already used by another person'});
      }
    };
  }

  private _changeUserReaction(): IReactionDisposer {
    return reaction(
      () => this.ref,
      (ref, prev) => {
        if (ref?.id !== prev?.id) {
          this._unsubRef();
          if (ref) {
            this._unsubRef = ref.onSnapshot(snapshot => {
              const user = snapshot.data();
              if (user) {
                this.name = user.name;
                this.avatar = user.avatar;
                this.email = user.email;
                this.theme = user.theme ?? Theme.dark;
                this.shortName = user.shortName;
                this._color = user.color;
                this.bio = user.bio;
              }
            });
          }
        }
      },
    );
  }

  constructor() {
    super();
    makeObservable(this);
    this._changeUserReaction();
  }
}

export default new AccountModel();
