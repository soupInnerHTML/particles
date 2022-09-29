import React from 'react';
import {View} from 'react-native';
import {Text, useTheme} from '@ui-kitten/components';
import {ScaledSheet} from 'react-native-size-matters';

const ChipsText: React.FC = ({children}) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.chips,
        {
          backgroundColor: theme['border-basic-color-3'],
        },
      ]}>
      <Text category={'p2'}>{children}</Text>
    </View>
  );
};

const styles = ScaledSheet.create({
  chips: {
    paddingVertical: '4@vs',
    paddingHorizontal: '8@s',
    alignSelf: 'flex-start',
    borderRadius: '16@s',
  },
});

export default ChipsText;
