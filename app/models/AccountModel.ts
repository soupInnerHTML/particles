// import {hydrate} from './persist/hydrate';
import {computed, makeObservable, observable} from 'mobx';
import {IUserModel} from './UserModel';
import ModelWithStatus from './abstract/ModelWithStatus';
import generateAvatarPlaceholder from '../utils/generateAvatarPlaceholder';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

// @hydrate
class AccountModel extends ModelWithStatus implements IMaybe<IUserModel> {
  @observable public id?: string;
  @observable public email?: string;
  @observable public avatar?: string;
  @observable public name?: string;
  @observable public postsOwner?: string[];
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
