import React from 'react';
import {TextProps} from '@ui-kitten/components';
import {useTypingText} from '@hooks/useTypingText';
import {withSmooth} from '@hoc/withSmooth';
import {ReText} from 'react-native-redash';

const SmoothReText = withSmooth(ReText);

const TypingSmoothReText: React.FC<TextProps> = ({style}) => {
  const typingText = useTypingText();
  return <SmoothReText style={style} text={typingText} />;
};

export default TypingSmoothReText;
