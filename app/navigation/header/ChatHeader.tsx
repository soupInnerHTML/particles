import React, {useEffect, useState} from 'react';
import {IUserModel} from '../../models/mobx/AccountModel';
import TopNavigationHeader from './TopNavigationHeader';
import dayjs from 'dayjs';
import PressableAccountAvatar from '../../views/atoms/PressableAccountAvatar';
import generateAvatarPlaceholder from '../../utils/generateAvatarPlaceholder';
import {observer} from 'mobx-react-lite';
import relativeTime from 'dayjs/plugin/relativeTime';
import firestore from '@react-native-firebase/firestore';
import {ONLINE_TIMING} from '../../hooks/useOnlineDaemon';
import useIsOnline from '../../hooks/useIsOnline';
import useFirestoreUser from '../../hooks/useFirestoreUser';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'react-native';
import {chatPlaceholderStyles} from '@atoms/ChatPlaceholder';
import usePlaceholderColors from '@hooks/usePlaceholderColors';

dayjs.extend(relativeTime);

const ChatHeader: React.FC<{userId: string}> = ({userId}) => {
  const user = useFirestoreUser(userId);
  const isOnline = useIsOnline(user?.lastSeen.seconds ?? 0);
  const lastSeen = user?.lastSeen?.seconds
    ? dayjs.unix(Number(user.lastSeen.seconds)).fromNow()
    : 'never';
  const {highlightColor, backgroundColor} = usePlaceholderColors();

  return (
    <TopNavigationHeader
      title={user?.name ?? 'John Doe'}
      subtitle={isOnline ? 'online' : 'Last seen ' + lastSeen}
      right={
        user ? (
          <PressableAccountAvatar
            id={userId}
            image={
              user?.avatar || generateAvatarPlaceholder(user?.name, user?.color)
            }
          />
        ) : (
          <SkeletonPlaceholder {...{highlightColor, backgroundColor}}>
            <View style={chatPlaceholderStyles.avatarSmall} />
          </SkeletonPlaceholder>
        )
      }
      canGoBack
    />
  );
};

export default observer(ChatHeader);
