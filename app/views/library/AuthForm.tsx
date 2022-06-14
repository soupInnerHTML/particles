import React, {useEffect, useState} from 'react';
import {Button, TextInput, View} from 'react-native';
import AccountModel, {IAuth} from '../../models/AccountModel';
import {Navigation} from 'react-native-navigation';
import {NavigationComponents} from '../../navigation';
import {observer} from 'mobx-react-lite';
import {ScaledSheet} from 'react-native-size-matters';

// import {InputItem} from '@ant-design/react-native';

interface IProps {
  fields: string[];
  buttonTitle: string;
  onSubmit: (params: IAuth) => void;
  componentId: string;
}

const AuthForm: React.FC<IProps> = ({
  fields,
  buttonTitle,
  componentId,
  onSubmit,
}) => {
  useEffect(() => {
    if (AccountModel.isAuthenticated) {
      Navigation.push(componentId, {
        component: {name: NavigationComponents.POSTS},
      });
      // Navigation.popToRoot(componentId);
    }
  }, [AccountModel.isAuthenticated]);
  const [values, setValues] = useState<any>({});
  return (
    <>
      {fields.map(field => (
        <TextInput
          key={field}
          placeholder={field}
          onChange={e => setValues({...values, [field]: e.nativeEvent.text})}
        />
      ))}
      <View style={styles.submit}>
        <Button
          disabled={AccountModel.isPending}
          title={buttonTitle}
          onPress={() =>
            onSubmit({email: values.email, password: values.password})
          }
        />
      </View>
    </>
  );
};

const styles = ScaledSheet.create({
  submit: {
    position: 'absolute',
    bottom: '16@vs',
    right: 0,
    left: 0,
  },
});

export default observer(AuthForm);
