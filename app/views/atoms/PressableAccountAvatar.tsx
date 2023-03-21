import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {Avatar, AvatarProps} from '@ui-kitten/components';
import React from 'react';
import useAppNavigation from '../../hooks/useAppNavigation';
import {withSmooth} from '@hoc/withSmooth';

interface IPressableAccountAvatarImageProps {
  image: string;
  id: string;
}

const PressableAccountAvatar: React.FC<
  IPressableAccountAvatarImageProps &
    Omit<AvatarProps, 'source'> &
    TouchableOpacityProps
> = ({image, id, onPress, ...props}) => {
  const navigation = useAppNavigation();
  return (
    <TouchableOpacity
      {...props}
      onPress={event =>
        onPress
          ? onPress(event)
          : navigation.navigate('Account', {screen: 'Profile', params: {id}})
      }>
      <Avatar
        source={{
          uri: image,
        }}
        {...props}
      />
    </TouchableOpacity>
  );
};

export default withSmooth(PressableAccountAvatar);
