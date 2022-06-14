import {action, computed, observable} from 'mobx';

enum EStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

abstract class ModelWithStatus {
  @observable status: EStatus = EStatus.NONE;

  @computed get isNone() {
    return this.status === EStatus.NONE;
  }
  @computed get isPending() {
    return this.status === EStatus.PENDING;
  }
  @computed get isDone() {
    return this.status === EStatus.DONE;
  }
  @computed get isError() {
    return this.status === EStatus.ERROR;
  }

  @action setStatus(status: keyof typeof EStatus) {
    this.status = EStatus[status];
  }
}

export default ModelWithStatus;
