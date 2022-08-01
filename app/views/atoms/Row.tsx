import React from 'react';
import {FlexAlignType, StyleProp, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface IRowProps {
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: FlexAlignType;
  style?: StyleProp<ViewStyle>;
}

const Row: React.FC<IRowProps> = ({
  children,
  justifyContent,
  alignItems,
  style,
}) => {
  return (
    <View style={[styles.row, {justifyContent, alignItems}, style]}>
      {children}
    </View>
  );
};

const styles = ScaledSheet.create({
  row: {
    flexDirection: 'row',
  },
});

export default Row;
