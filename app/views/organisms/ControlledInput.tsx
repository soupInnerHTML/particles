import React, {FC} from 'react';
import {Controller, ControllerProps} from 'react-hook-form';
import {Icon, Input, InputProps, Text, useTheme} from '@ui-kitten/components';
import InputIcons from '../molecules/InputIcons';
import normalizeText from '../../utils/normalizeText';
import {ScaledSheet} from 'react-native-size-matters';
import {View} from 'react-native';
import SmoothView from '../atoms/SmoothView';
import renderIf from '../../utils/renderIf';

type IControlledInputProps = InputProps &
  Omit<ControllerProps, 'render'> & {cleanable?: boolean};

const ControlledInput: FC<IControlledInputProps> = ({
  name,
  control,
  cleanable = true,
  ...props
}) => {
  const [tempSecureTextEntry, setTempSecureTextEntry] = React.useState(
    props.secureTextEntry,
  );

  const toggleSecureEntry = () => {
    setTempSecureTextEntry(next => !next);
  };

  const Icons = (iconProps: unknown) => (
    <InputIcons
      iconProps={iconProps}
      name={name}
      secure={props.secureTextEntry}
      cleanable={cleanable}
      secureTextEntry={tempSecureTextEntry}
      {...{toggleSecureEntry}}
    />
  );

  const theme = useTheme();

  return (
    <Controller
      control={control}
      render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
        <View style={styles.container}>
          <Input
            style={styles.input}
            {...props}
            accessoryRight={Icons}
            secureTextEntry={tempSecureTextEntry}
            status={error ? 'danger' : 'basic'}
            onChange={e => onChange(e.nativeEvent.text)}
            {...{onBlur, value}}
          />
          {renderIf(error?.message, () => (
            <SmoothView style={styles.text}>
              <Icon
                name={'alert-circle-outline'}
                width={16}
                height={16}
                fill={theme['text-danger-color']}
                backgroundColor={'#fff'}
              />
              <Text category={'p2'} status={'danger'}>
                {' ' + normalizeText(error?.message!)}
              </Text>
            </SmoothView>
          ))}
        </View>
      )}
      name={name}
    />
  );
};

const styles = ScaledSheet.create({
  container: {
    position: 'relative',
  },
  text: {
    position: 'absolute',
    bottom: -16,
    flexDirection: 'row',
  },
  input: {
    marginTop: '20@vs',
  },
});

export default ControlledInput;
