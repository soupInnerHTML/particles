import FirestoreModel from './abstract/FirestoreModel';
import {IUserModel} from './UserModel';
import {action, makeObservable, override} from 'mobx';

class UsersModel extends FirestoreModel<IUserModel> {
  @action getUser(id: string) {
    return this.data.find(user => user.id === id);
  }

  @override
  protected get _filteredInstance() {
    return this._instance;
  }

  constructor() {
    super();
    makeObservable(this);
    this.getData();
  }
}

export default new UsersModel();
