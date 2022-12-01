import React from 'react';
import TopNavigationHeader from './TopNavigationHeader';
import dayjs from 'dayjs';
import PressableAccountAvatar from '../../views/atoms/PressableAccountAvatar';
import {observer} from 'mobx-react-lite';
import relativeTime from 'dayjs/plugin/relativeTime';
import useIsOnline from '../../hooks/useIsOnline';
import useFirestoreUser from '../../hooks/useFirestoreUser';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'react-native';
import {chatPlaceholderStyles} from '@atoms/ChatPlaceholder';
import usePlaceholderColors from '@hooks/usePlaceholderColors';
import getLastSeen from '@utils/getLastSeen';

dayjs.extend(relativeTime);

const ChatHeader: React.FC<{userId: string}> = ({userId}) => {
  const user = useFirestoreUser(userId);
  const isOnline = useIsOnline(user?.lastSeen?.seconds ?? 0);
  const lastSeen = getLastSeen(user?.lastSeen?.seconds);
  const {highlightColor, backgroundColor} = usePlaceholderColors();

  return (
    <TopNavigationHeader
      title={user?.name ?? 'John Doe'}
      subtitle={isOnline ? 'online' : lastSeen}
      right={
        user ? (
          <PressableAccountAvatar
            id={userId}
            image={user.avatar || user.avatarPlaceholder}
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
