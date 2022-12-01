import React from 'react';
import {Platform, Switch} from 'react-native';
import {Text, Toggle} from '@ui-kitten/components';
import Row from '@atoms/Row';
import commonStyles from '../styles/commonStyles';

interface ICustomSwitchProps {
  text: string;
  checked: boolean;
  onChange: (checked: boolean) => unknown;
}

const CustomSwitch: React.FC<ICustomSwitchProps> = ({
  text,
  checked,
  onChange,
}) => {
  return (
    <Row alignItems={'center'} style={commonStyles.mt8}>
      {Platform.OS !== 'ios' ? (
        <React.Fragment>
          <Switch onValueChange={onChange} value={checked} />
          <Text>{text}</Text>
        </React.Fragment>
      ) : (
        <Toggle {...{onChange, checked}}>
          <Text>{text}</Text>
        </Toggle>
      )}
    </Row>
  );
};

export default CustomSwitch;
