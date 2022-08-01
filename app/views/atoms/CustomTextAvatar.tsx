import {StyleProp, View, ViewStyle} from 'react-native';
import React, {FC, useMemo} from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import {Text} from '@ui-kitten/components';

export interface ICustomTextAvatarProps {
  label: string;
  size?: number;
  color: string;
}

const CustomTextAvatar: FC<ICustomTextAvatarProps> = ({
  label,
  size = 34,
  color,
}) => {
  const baseStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      width: size,
      height: size,
      borderRadius: size,
      backgroundColor: color,
    }),
    [size, color],
  );
  return (
    <View style={[styles.wrapper, baseStyle]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = ScaledSheet.create({
  wrapper: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

export default CustomTextAvatar;
