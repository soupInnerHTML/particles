import {action, computed, observable} from 'mobx';

export enum EStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

abstract class StatusModel {
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

  // legacy
  @action setStatus(status: keyof typeof EStatus) {
    this.status = EStatus[status];
  }
  @action setPendingStatus() {
    this.status = EStatus.PENDING;
  }
  @action setErrorStatus() {
    this.status = EStatus.ERROR;
  }
  @action setDoneStatus() {
    this.status = EStatus.DONE;
  }
  @action setNoneStatus() {
    this.status = EStatus.NONE;
  }
}

export default StatusModel;
