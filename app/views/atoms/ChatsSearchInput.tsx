import React, {useRef, useState} from 'react';
import {Icon, Input, Text} from '@ui-kitten/components';
import {ScaledSheet} from 'react-native-size-matters';
import Row from './Row';
import {TouchableOpacity} from 'react-native';
import ChatsModel from '@models/mobx/ChatsModel';
import {observer} from 'mobx-react-lite';

const ChatsSearchInput: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const {setSearchPath, searchPath} = ChatsModel;
  const ref = useRef<Input>(null);

  return (
    <Row style={styles.container} alignItems={'center'}>
      <Input
        blurOnSubmit
        value={searchPath}
        ref={ref}
        onChangeText={setSearchPath}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessoryLeft={props => <Icon {...props} name={'search'} />}
        placeholder={'Search for chats'}
        size={'small'}
        style={styles.input}
      />
      {isFocused && (
        <TouchableOpacity
          style={styles.cancel}
          onPress={() => {
            ref.current?.blur();
            setSearchPath('');
          }}>
          <Text status={'primary'}>Cancel</Text>
        </TouchableOpacity>
      )}
    </Row>
  );
};

const styles = ScaledSheet.create({
  container: {
    marginHorizontal: '8@s',
    marginTop: '-8@vs',
  },
  input: {
    marginBottom: '8@vs',
    borderRadius: '16@s',
    flexGrow: 1,
  },
  cancel: {
    marginLeft: '8@s',
  },
});

export default observer(ChatsSearchInput);
