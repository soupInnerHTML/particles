import {ActionSheetIOS} from 'react-native';
import {noop} from 'lodash';
import AccountModel from '@models/mobx/AccountModel';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import vibrate from '@utils/vibrate';

interface IActionsConfig {
  title: string;
  callback: () => unknown;
  destructive?: boolean;
}

export default function (config: IActionsConfig[]) {
  const CANCEL_TITLE = 'Cancel';
  let cancelButtonIndex = config.findIndex(
    action => action.title === CANCEL_TITLE,
  );
  if (cancelButtonIndex < 0) {
    config.unshift({
      title: CANCEL_TITLE,
      callback: noop, //do nothing
    });
    cancelButtonIndex = 0;
  }

  const options = config.map(action => action.title);
  const destructiveButtonIndexes = config
    .map((action, index) => (action.destructive ? index : null))
    .filter(action => action !== null) as number[];

  ActionSheetIOS.showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex,
      destructiveButtonIndex: destructiveButtonIndexes,
      userInterfaceStyle: AccountModel.theme,
    },
    index => config[index].callback(),
  );

  vibrate();
}
