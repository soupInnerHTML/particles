import {NativeStackScreenProps} from 'react-native-screens/native-stack';

type RootStackParamList = {
  Login: NestedStack<LoginStackParamList>;
  Main: NestedStack<MainStackParamList>;
  Account: NestedStack<AccountStackParamList>;
};

type NestedStack<Stack> = {screen: keyof Stack; params?: Stack[keyof Stack]};

type LoginStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
};

type MainStackParamList = {
  Chats: undefined;
  Chat: {userId: string; id: string};
};

type AccountStackParamList = {
  Profile: {id?: number};
  AccountSettings: undefined;
};

type TabParamList = {};

type Routes = RootStackParamList &
  LoginStackParamList &
  MainStackParamList &
  AccountStackParamList;

type ERouteNames = keyof Routes;
type StackItem<T extends ERouteNames> = NativeStackScreenProps<Routes, T>;
type INavigation<T extends keyof RootStackParamList = any> =
  StackItem<T>['navigation'];
type IRoute<T extends ERouteNames = any> = StackItem<T>['route'];
