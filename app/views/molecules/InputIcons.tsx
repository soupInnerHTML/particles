import React, {FC} from 'react';
import {TouchableOpacity} from 'react-native';
import Row from '../atoms/Row';
import {Icon} from '@ui-kitten/components';
import {useFormContext} from 'react-hook-form';
import renderIf from '../../utils/renderIf';
import SmoothView from '../atoms/SmoothView';

interface IInputIconsProps {
  secure: Maybe<boolean>;
  secureTextEntry: Maybe<boolean>;
  toggleSecureEntry: () => void;
  name: string;
  iconProps: unknown;
  cleanable?: boolean;
}

const InputIcons: FC<IInputIconsProps> = ({
  secure,
  toggleSecureEntry,
  secureTextEntry,
  name,
  iconProps,
  cleanable = true,
}) => {
  const {setValue, getValues} = useFormContext();
  const isNotEmpty = getValues()[name];
  return renderIf(isNotEmpty, () => (
    <SmoothView>
      <Row>
        {cleanable && (
          <TouchableOpacity onPress={() => setValue(name, '')}>
            <Icon {...iconProps} name={'close'} />
          </TouchableOpacity>
        )}
        {secure && (
          <TouchableOpacity onPress={toggleSecureEntry}>
            <Icon {...iconProps} name={secureTextEntry ? 'eye-off' : 'eye'} />
          </TouchableOpacity>
        )}
      </Row>
    </SmoothView>
  ));
};

export default InputIcons;
