import React, {FC} from 'react';
import renderIf from '../../utils/renderIf';
import normalizeText from '../../utils/normalizeText';
import {
  Divider,
  Icon,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import useAppNavigation from '../../hooks/useAppNavigation';
import {ScaledSheet} from 'react-native-size-matters';

const BackAction = () => {
  const navigation = useAppNavigation();
  return (
    <TopNavigationAction
      onPress={navigation.goBack}
      icon={<Icon name="arrow-back" />}
    />
  );
};

export interface IHeaderProps {
  title: string;
  subtitle?: string;
  canGoBack?: any;
  right?: any;
  Wrapper?: FC<any>;
}

const Header: React.FC<IHeaderProps> = ({
  title,
  subtitle = '',
  canGoBack,
  right,
  children,
  Wrapper = React.Fragment,
}) => {
  return (
    <React.Fragment>
      <Wrapper>
        <TopNavigation
          style={styles.nav}
          accessoryLeft={renderIf(canGoBack, () => (
            <BackAction />
          ))}
          accessoryRight={right}
          title={normalizeText(title)}
          subtitle={subtitle}
          alignment={'center'}
        />
      </Wrapper>
      {children}
      <Divider />
    </React.Fragment>
  );
};

const styles = ScaledSheet.create({
  nav: {
    paddingHorizontal: '8@s',
  },
});

export default Header;
