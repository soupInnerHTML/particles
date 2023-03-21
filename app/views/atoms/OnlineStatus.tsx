import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useTheme} from '@ui-kitten/components';
import SmoothView from './SmoothView';

const OnlineStatus: React.FC<{online: boolean}> = ({online}) => {
  const theme = useTheme();
  return online ? (
    <SmoothView style={styles.wrapper}>
      <View
        style={[styles.dot, {backgroundColor: theme['color-primary-400']}]}
      />
    </SmoothView>
  ) : null;
};

const styles = ScaledSheet.create({
  dot: {
    borderRadius: '8@s',
    width: '8@s',
    height: '8@s',
    backgroundColor: 'green',
    position: 'absolute',
    bottom: '2@s',
    right: '4@s',
  },
  wrapper: {
    zIndex: 999,
  },
});

export default OnlineStatus;
