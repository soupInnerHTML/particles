// import {hydrate} from './persist/hydrate';
import {computed, makeObservable, observable} from 'mobx';
import {IUserModel} from './UserModel';
import ModelWithStatus from './abstract/ModelWithStatus';
import generateAvatarPlaceholder from '../utils/generateAvatarPlaceholder';

// @hydrate
class AccountModel extends ModelWithStatus implements IMaybe<IUserModel> {
  @observable public id?: string;
  @observable public email?: string;
  @observable public avatar?: string;
  @observable public name?: string;
  @observable public postsOwner?: string[];

  @computed public get avatarPlaceholder() {
    return generateAvatarPlaceholder(this.name);
  }

  constructor() {
    super();
    makeObservable(this);
  }
}

export default new AccountModel();
