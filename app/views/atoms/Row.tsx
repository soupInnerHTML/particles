import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface IRowProps {
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  style?: StyleProp<ViewStyle>;
}

const Row: React.FC<IRowProps> = ({children, justifyContent, style}) => {
  return <View style={[styles.row, {justifyContent}, style]}>{children}</View>;
};

const styles = ScaledSheet.create({
  row: {
    flexDirection: 'row',
  },
});

export default Row;
