import {Alert, Platform, ToastAndroid} from 'react-native';

export default function (text: string) {
  return Platform.select({
    ios: (t: string) => Alert.alert(t),
    android: (t: string) => ToastAndroid.show(t, ToastAndroid.SHORT),
  })!(text);
}
