import {useNavigation} from '@react-navigation/native';
import {INavigation} from '../navigation/navigation.types';

export default function () {
  return useNavigation<INavigation>();
}
