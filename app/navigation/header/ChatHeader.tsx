import React from 'react';
import TopNavigationHeader from './TopNavigationHeader';
import dayjs from 'dayjs';
import PressableAccountAvatar from '../../views/atoms/PressableAccountAvatar';
import relativeTime from 'dayjs/plugin/relativeTime';
import useFirestoreUser from '../../hooks/useFirestoreUser';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from 'react-native';
import {chatPlaceholderStyles} from '@atoms/ChatPlaceholder';
import usePlaceholderColors from '@hooks/usePlaceholderColors';
import {TextProps} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import {ChatHeaderSubtitle} from './ChatHeaderSubtitle';
import SmoothView from '@atoms/SmoothView';

dayjs.extend(relativeTime);

const ChatHeader: React.FC<{userId: string}> = ({userId}) => {
  const user = useFirestoreUser(userId);
  const {highlightColor, backgroundColor} = usePlaceholderColors();

  const renderSubtitle: RenderProp<TextProps> = props => (
    <ChatHeaderSubtitle
      {...props}
      timestamp={user?.lastSeen.seconds}
      userId={user?.id}
    />
  );

  return (
    <TopNavigationHeader
      title={user?.name ?? 'John Doe'}
      subtitle={renderSubtitle}
      right={
        user && (
          <PressableAccountAvatar
            id={userId}
            image={user.avatar || user.avatarPlaceholder}
            style={{zIndex: 2}}
          />
        )
        // TODO исправить баг: когда рендерится placeholder невозможно нажать на аватар, либо перекрывает его
        // <SkeletonPlaceholder {...{highlightColor, backgroundColor}}>
        //   <View style={chatPlaceholderStyles.avatarSmall} />
        // </SkeletonPlaceholder>
      }
      canGoBack
    />
  );
};

export default ChatHeader;
