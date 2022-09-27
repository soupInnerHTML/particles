import React from 'react';
import {View} from 'react-native';
import commonStyles from '../styles/commonStyles';
import Row from '../atoms/Row';
import PressableAccountAvatar from '../atoms/PressableAccountAvatar';
import generateAvatarPlaceholder from '../../utils/generateAvatarPlaceholder';
import {Text} from '@ui-kitten/components';
import dayjs from 'dayjs';

const PostTopInfo: ({
  authorUser,
  date,
}: {
  authorUser: any;
  date: any;
}) => JSX.Element = ({authorUser, date}) => {
  return (
    <View style={[commonStyles.mh16]}>
      <Row>
        <PressableAccountAvatar
          image={
            authorUser?.avatar ||
            generateAvatarPlaceholder(authorUser?.name, '000')
          }
        />
        <View style={commonStyles.ml8}>
          <Text>{authorUser?.name}</Text>
          <Text>{dayjs(date).fromNow()}</Text>
        </View>
      </Row>
    </View>
  );
};

export default PostTopInfo;
