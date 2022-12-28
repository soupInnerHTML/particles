import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {INavigation, IRoute} from './navigation';
import TextButton from '@atoms/TextButton';
import {ScaledSheet} from 'react-native-size-matters';

const SettingsRight: React.FC = () => {
  const navigation = useNavigation<INavigation<'Settings'>>();
  const {
    params: {save, changed, valid},
  } = useRoute<IRoute<'Settings'>>();

  return (
    <TextButton
      style={styles.btn}
      disabled={!valid || !changed}
      onPress={() => {
        navigation.setParams({save: save + 1});
      }}>
      Save
    </TextButton>
  );
};

const styles = ScaledSheet.create({
  btn: {
    marginRight: '8@s',
  },
});

export default SettingsRight;
