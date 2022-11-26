import React from 'react';
import {View} from 'react-native';
import {Avatar} from '@ui-kitten/components';
import OnlineStatus from '@atoms/OnlineStatus';
import {ScaledSheet} from 'react-native-size-matters';
import useIsOnline from '@hooks/useIsOnline';
import {IChatComponentsProps} from '@organisms/Chat';

type IChatAvatarProps = Omit<IChatComponentsProps, 'lastMessage'>;

const ChatAvatar: React.FC<IChatAvatarProps> = ({companion}) => {
  const isOnline = useIsOnline(companion?.lastSeen?.seconds ?? 0);
  return (
    <View>
      <Avatar
        source={{
          uri: companion?.avatar || companion?.avatarPlaceholder,
        }}
        style={styles.avatar}
      />
      <OnlineStatus online={isOnline} />
    </View>
  );
};

const styles = ScaledSheet.create({
  avatar: {
    height: '40@vs',
    width: '40@vs',
  },
});

export default ChatAvatar;
