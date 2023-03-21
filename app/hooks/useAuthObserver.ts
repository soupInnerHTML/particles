import AuthModel from '@models/mobx/AuthModel';
import {useEffect, useRef} from 'react';
import {Platform} from 'react-native';
import {CommonActions, NavigationContainerRef} from '@react-navigation/native';
import {
  LoginStackParamListDto,
  RootStackParamList,
} from '../navigation/navigation.types';

function _isLogin(routeName: string | undefined) {
  return routeName && Object.keys(LoginStackParamListDto).includes(routeName);
}

export function useAuthObserver() {
  const ref = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const {isAuthenticated} = AuthModel;
  function isComponentMatch() {
    const route = ref.current?.getCurrentRoute();
    const isLogin = _isLogin(route?.name);
    return isAuthenticated ? !isLogin : isLogin;
  }

  useEffect(() => {
    if (!isComponentMatch()) {
      // if (Platform.OS === 'ios') {
      //   // @ts-ignore
      //   ref.current?.navigate(isAuthenticated ? 'Main' : 'Login');
      // }
      // if (Platform.OS === 'android') {
      ref.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: isAuthenticated ? 'Main' : 'Login'}],
        }),
      );
      // }
    }
  }, [isAuthenticated]);

  return {
    ref,
  };
}
