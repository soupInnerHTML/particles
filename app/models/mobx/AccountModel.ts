import {computed, makeObservable, observable} from 'mobx';
import ModelWithStatus from '../abstract/ModelWithStatus';
import generateAvatarPlaceholder from '../../utils/generateAvatarPlaceholder';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

interface IUserModelWithoutId {
  name: string;
  email: string;
  postsOwner?: string[];
  avatar?: string;
  color?: string;
  lastSeen: FirebaseFirestoreTypes.Timestamp;
  theme: Theme;
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
  @observable public postsOwner?: string[];
  @observable public theme = Theme.dark;
  @observable public lastSeen?: FirebaseFirestoreTypes.Timestamp;

  @computed public get avatarPlaceholder() {
    return generateAvatarPlaceholder(this.name);
  }

  constructor() {
    super();
    makeObservable(this);
  }
}

export default new AccountModel();
