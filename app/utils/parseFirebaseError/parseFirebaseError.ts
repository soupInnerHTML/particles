import {ReactNativeFirebase} from '@react-native-firebase/app';
import errors from './errors.json';

export default function (e: ReactNativeFirebase.NativeFirebaseError): string {
  const [level1, level2] = e.code.split('/');
  // @ts-ignore
  return errors?.[level1]?.[level2] ?? e.nativeErrorMessage;
}
