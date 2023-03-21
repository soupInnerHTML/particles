import {NativeStackScreenProps} from 'react-native-screens/native-stack';

export type RootStackParamList = {
  Login: NestedStack<LoginStackParamList>;
  Main: NestedStack<MainStackParamList>;
  Account: NestedStack<AccountStackParamList>;
  Settings: {
    changed: boolean;
    valid: boolean;
    save: number;
  };
};

type NestedStack<Stack> = {screen: keyof Stack; params?: Stack[keyof Stack]};

export const LoginStackParamListDto = {
  SignIn: undefined,
  SignUp: undefined,
  ResetPassword: undefined,
};

export type LoginStackParamList = typeof LoginStackParamListDto;

type MainStackParamList = {
  Chats: undefined;
  Chat: {userId: string; id: string};
};

type AccountStackParamList = {
  Profile: {id: string};
  AccountSettings: undefined;
};

export type TabParamList = {};

type Routes = RootStackParamList &
  LoginStackParamList &
  MainStackParamList &
  AccountStackParamList;

type ERouteNames = keyof Routes;
export type StackItem<T extends ERouteNames> = NativeStackScreenProps<
  Routes,
  T
>;
export type INavigation<T extends keyof RootStackParamList = any> =
  StackItem<T>['navigation'];
export type IRoute<T extends ERouteNames = any> = StackItem<T>['route'];
