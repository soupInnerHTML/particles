import React from 'react';
import {Platform, Switch} from 'react-native';
import {Text, Toggle} from '@ui-kitten/components';
import Row from '@atoms/Row';
import commonStyles from '../styles/commonStyles';

interface ICustomSwitchProps {
  text: string;
  checked: boolean;
  onChange: (checked: boolean) => void | Promise<void>;
  disabled?: boolean;
}

const CustomSwitch: React.FC<ICustomSwitchProps> = ({
  text,
  checked,
  onChange,
  disabled,
}) => {
  return (
    <Row alignItems={'center'} style={commonStyles.mt16}>
      {Platform.OS !== 'ios' ? (
        <React.Fragment>
          <Switch
            disabled={disabled}
            onValueChange={onChange}
            value={checked}
          />
          <Text>{text}</Text>
        </React.Fragment>
      ) : (
        <Toggle {...{onChange, checked, disabled}}>
          <Text>{text}</Text>
        </Toggle>
      )}
    </Row>
  );
};

export default CustomSwitch;
