import React from 'react';
import {observer} from 'mobx-react-lite';
import {StackItem} from '../../../navigation/navigation.types';
import {Layout, Text} from '@ui-kitten/components';
import useFirestoreUser from '@hooks/useFirestoreUser';
import PressableAccountAvatar from '@atoms/PressableAccountAvatar';
import {ScaledSheet} from 'react-native-size-matters';
import {View} from 'react-native';
import commonStyles from '../../styles/commonStyles';
import getLastSeen from '@utils/getLastSeen';
import useIsOnline from '@hooks/useIsOnline';
import OnlineStatus from '@atoms/OnlineStatus';
import {withSmooth} from '@hoc/withSmooth';
import {useAvatarChange} from '@hooks/useAvatarChange';
import AccountModel from '@models/mobx/AccountModel';
import {noop} from 'lodash';

const SmoothText = withSmooth(Text);

const AccountScreen: React.FC<StackItem<'Profile'>> = ({route}) => {
  const {id} = route.params;
  const user = useFirestoreUser(id);
  const {seconds} = user?.lastSeen || {};
  const isOnline = useIsOnline(id);
  const {changeAvatar} = useAvatarChange();
  return (
    <Layout style={{flex: 1}}>
      <View style={styles.headerContainer}>
        <PressableAccountAvatar
          style={[styles.avatar, commonStyles.mv8]}
          id={id}
          image={(user?.avatar || user?.avatarPlaceholder) ?? ''}
          onPress={id === AccountModel.id ? changeAvatar : noop}
        />
        <View style={styles.online}>
          <OnlineStatus online={isOnline} />
        </View>
        <Text category={'h1'}>{user?.name}</Text>
        <Text category={'h6'}>{'@' + user?.shortName}</Text>
        {!!user?.bio && (
          <Text style={commonStyles.mt8}>{'ℹ️✏️ ' + user.bio}</Text>
        )}

        {!isOnline && (
          <SmoothText style={[commonStyles.mt16]}>
            {getLastSeen(seconds ?? 0)}
          </SmoothText>
        )}
      </View>
    </Layout>
  );
};

const styles = ScaledSheet.create({
  avatar: {
    width: '96@s',
    height: '96@s',
  },
  headerContainer: {
    alignItems: 'center',
  },
  online: {
    transform: [{scale: 2}],
    right: '-50@s',
    top: '-10@vs',
  },
});

export default observer(AccountScreen);
