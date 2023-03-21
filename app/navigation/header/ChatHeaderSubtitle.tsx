import React from 'react';
import {TextProps, useTheme} from '@ui-kitten/components';
import {useIsTyping} from '@hooks/useIsTyping';
import useIsOnline from '@hooks/useIsOnline';
import getLastSeen from '@utils/getLastSeen';
import {useDerivedValue} from 'react-native-reanimated';
import {ReText} from 'react-native-redash';
import {withSmooth} from '@hoc/withSmooth';
import TypingSmoothReText from '@atoms/TypingSmoothReText';

interface IChatHeaderSubtitleProps {
  userId?: string;
  timestamp?: number;
}

const SmoothReText = withSmooth(ReText);

export const ChatHeaderSubtitle: React.FC<
  IChatHeaderSubtitleProps & TextProps
> = ({userId, timestamp, style}) => {
  const isTyping = useIsTyping(userId);
  const isOnline = useIsOnline(userId);
  const lastSeen = getLastSeen(timestamp);
  const onlineStatus = useDerivedValue(() => (isOnline ? 'online' : lastSeen));
  const primaryColor = useTheme()['color-primary-400'];

  //duplicated SmoothReText for layout animations on status changing
  return (
    <React.Fragment>
      {isTyping && isOnline && (
        <TypingSmoothReText style={[style, {color: primaryColor}]} />
      )}
      {isTyping && !isOnline && <TypingSmoothReText style={style} />}
      {!isTyping && isOnline && (
        <SmoothReText
          style={[style, {color: primaryColor}]}
          text={onlineStatus}
        />
      )}
      {!isTyping && !isOnline && (
        <SmoothReText style={style} text={onlineStatus} />
      )}
    </React.Fragment>
  );
};
