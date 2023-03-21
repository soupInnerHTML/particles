import React, {FC} from 'react';
import {Image} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

export const NotificationAvatar: FC<{uri: string}> = ({uri}) => {
  return (
    <Image
      style={styles.image}
      source={{
        uri,
      }}
    />
  );
};

const styles = ScaledSheet.create({
  image: {
    width: '40@s',
    height: '40@s',
    borderRadius: '40@s',
    marginRight: '8@s',
  },
});
