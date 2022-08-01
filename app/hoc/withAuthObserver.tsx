import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import useAppNavigation from '../hooks/useAppNavigation';
import {useRoute} from '@react-navigation/native';
import AuthModel from '../models/AuthModel';

const withAuthObserver = (Component: React.FC<any>) =>
  observer((props: any) => {
    const navigation = useAppNavigation();
    const {name} = useRoute();
    const {isAuthenticated} = AuthModel;
    const isComponentMatch = isAuthenticated
      ? name !== 'Login'
      : name === 'Login';

    useEffect(() => {
      if (!isComponentMatch) {
        navigation.reset({
          index: 0,
          routes: [{name: isAuthenticated ? 'Main' : 'Login'}],
        });
      }
    }, [isAuthenticated, isComponentMatch]);
    return <Component {...props} />;
  });

export default withAuthObserver;
