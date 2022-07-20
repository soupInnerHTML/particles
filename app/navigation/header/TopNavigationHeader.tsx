import React from 'react';
import renderIf from '../../utils/renderIf';
import normalizeText from '../../utils/normalizeText';
import {Icon, TopNavigation, TopNavigationAction} from '@ui-kitten/components';
import useAppNavigation from '../../hooks/useAppNavigation';

const BackAction = () => {
  const navigation = useAppNavigation();
  return (
    <TopNavigationAction
      onPress={navigation.goBack}
      icon={<Icon name="arrow-back" />}
    />
  );
};

interface IHeaderProps {
  title: string;
  subtitle?: string;
  canGoBack?: any;
  right?: any;
}

const Header: React.FC<IHeaderProps> = ({
  title,
  subtitle = '',
  canGoBack,
  right,
}) => {
  return (
    <TopNavigation
      accessoryLeft={renderIf(canGoBack, () => (
        <BackAction />
      ))}
      accessoryRight={right}
      title={normalizeText(title)}
      subtitle={normalizeText(subtitle)}
      alignment={'center'}
    />
  );
};

export default Header;
