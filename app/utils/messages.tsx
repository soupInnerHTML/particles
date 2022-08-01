import {MessageOptions, showMessage} from 'react-native-flash-message';
import parseFirebaseError from './parseFirebaseError/parseFirebaseError';
import {ReactNativeFirebase} from '@react-native-firebase/app';

type ShowMessage = (args: Omit<MessageOptions, 'type'>) => void;

const commonConfig = {
  duration: 5000,
};

export const showError: ShowMessage = options => {
  showMessage({
    icon: 'danger',
    ...commonConfig,
    ...options,
    type: 'danger',
  });
};

export const showFirebaseError = (e: ReactNativeFirebase.NativeFirebaseError) =>
  showError(parseFirebaseError(e));

export const showSuccess: ShowMessage = options => {
  showMessage({
    icon: 'success',
    ...commonConfig,
    ...options,
    type: 'success',
  });
};

export const showWarning: ShowMessage = options => {
  showMessage({
    icon: 'warning',
    ...commonConfig,
    ...options,
    type: 'warning',
  });
};
