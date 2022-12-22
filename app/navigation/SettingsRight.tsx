import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {INavigation, IRoute} from './navigation';
import acc from '@models/mobx/AccountModel';
import renderIf from '@utils/renderIf';
import SmoothView from '@atoms/SmoothView';
import TextButton from '@atoms/TextButton';
import {observer} from 'mobx-react-lite';

const SettingsRight: React.FC = () => {
  const navigation = useNavigation<INavigation<'Settings'>>();
  const {params} = useRoute<IRoute<'Settings'>>();
  const {save, shortName, name, bio} = params || {};

  const changed =
    (name !== null && acc.name !== name) ||
    (shortName !== null && acc.shortName !== shortName) ||
    (bio !== null && acc.bio !== bio);

  return renderIf(changed, () => (
    //TODO: fix exiting
    <SmoothView exiting={undefined}>
      <TextButton
        onPress={() => {
          navigation.setParams({save: save + 1});
        }}>
        Save
      </TextButton>
    </SmoothView>
  ));
};

export default observer(SettingsRight);
