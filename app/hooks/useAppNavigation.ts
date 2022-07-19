import {useNavigation} from '@react-navigation/native';
import {INavigation} from '../navigation/navigation';

export default function () {
  return useNavigation<INavigation>();
}
