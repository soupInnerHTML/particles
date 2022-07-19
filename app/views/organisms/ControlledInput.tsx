import React, {FC} from 'react';
import {Controller, ControllerProps} from 'react-hook-form';
import {Icon, Input, InputProps, Text, useTheme} from '@ui-kitten/components';
import InputIcons from '../molecules/InputIcons';
import normalizeText from '../../utils/normalizeText';
import {ScaledSheet} from 'react-native-size-matters';
import {View} from 'react-native';
import SmoothView from '../atoms/SmoothView';
import Row from '../atoms/Row';
import renderIf from '../../utils/renderIf';

const ControlledInput: FC<InputProps & Omit<ControllerProps, 'render'>> = ({
  name,
  control,
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
      secureTextEntry={tempSecureTextEntry}
      {...{toggleSecureEntry}}
    />
  );

  const theme = useTheme();

  return (
    <Controller
      control={control}
      render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
        <View style={{position: 'relative'}}>
          <Input
            {...props}
            accessoryRight={Icons}
            secureTextEntry={tempSecureTextEntry}
            status={error ? 'danger' : 'basic'}
            onChange={e => onChange(e.nativeEvent.text)}
            {...{onBlur, value}}
          />
          {renderIf(
            error?.message,
            <SmoothView>
              <Row style={styles.text}>
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
              </Row>
            </SmoothView>,
          )}
        </View>
      )}
      name={name}
    />
  );
};

const styles = ScaledSheet.create({
  text: {
    position: 'absolute',
    bottom: '-14@vs',
  },
});

export default ControlledInput;
