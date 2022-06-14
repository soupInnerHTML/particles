import {action, computed, observable, reaction} from 'mobx';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import ModelWithStatus from './ModelWithStatus';
import {persist} from 'mobx-persist';

interface IOrderBy<T> {
  fieldPath: keyof T;
  directionStr?: 'asc' | 'desc';
}

abstract class FirestoreModel<LocalModel extends {}> extends ModelWithStatus {
  @persist('list') @observable.deep data: LocalModel[] = [];

  protected _name = this.constructor.name.replace('Model', '').toLowerCase();
  protected _orderBy: IOrderBy<LocalModel> = {
    fieldPath: 'date' as keyof LocalModel,
    directionStr: 'desc',
  };
  @computed protected get _instance() {
    return firestore().collection<LocalModel>(this._name);
  }
  @computed protected get _filteredInstance() {
    return this._instance.orderBy(
      this._orderBy.fieldPath,
      this._orderBy.directionStr,
    );
  }

  @action.bound protected _onSnapshot = (
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<LocalModel>,
  ) => {
    this.data = [];
    snapshot.forEach(item => {
      if (item.exists) {
        this.data.push({...item.data(), id: item.id});
      }
    });
  };

  @action.bound protected _onError = (error: Error) => {
    this.setStatus('ERROR');

    console.error(error);
  };

  @action async add(item: Omit<LocalModel, 'id'>) {
    await this._instance.add(<LocalModel>item);
  }

  @action getData = async () => {
    this.setStatus('PENDING');
    const data = await this._filteredInstance.get();
    this._onSnapshot(data);
    this.setStatus('DONE');
  };

  protected constructor() {
    super();
    this._filteredInstance.onSnapshot(this._onSnapshot, this._onError);

    reaction(
      () => this.data.length,
      isExist => {
        if (isExist) {
          this.setStatus('DONE');
        } else {
          this.setStatus('PENDING');
        }
      },
    );
  }
}

export default FirestoreModel;
