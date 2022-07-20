import {Alert, Platform, ToastAndroid} from 'react-native';

export default function (text: string) {
  return Platform.select({
    ios: (text: string) => Alert.alert(text),
    android: (text: string) => ToastAndroid.show(text, ToastAndroid.SHORT),
  })(text);
}
