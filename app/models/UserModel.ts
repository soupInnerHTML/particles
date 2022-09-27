import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

interface IUserModelWithoutId {
  name: string;
  email: string;
  postsOwner?: string[];
  avatar?: string;
  color?: string;
  lastSeen: FirebaseFirestoreTypes.Timestamp;
}

export type IUserModel = IWithId<IUserModelWithoutId>;

class UserModel implements IUserModel {
  public name!: string;
  public email!: string;
  public id!: string;
  public postsOwner?: string[];
  public avatar?: string;

  constructor(params: IUserModel) {
    let key: keyof IUserModel;
    for (key in params) {
      // @ts-ignore
      this[key] = params[key];
    }
  }
}

export default UserModel;
