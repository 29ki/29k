import React from 'react';
import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import ActionButton from './ActionItems/ActionButton';
import ActionList from './ActionList';
import {ProfileIcon} from '../Icons';
import {Alert} from 'react-native';
import ActionTextInput from './ActionItems/ActionTextInput';
import ActionSwitch from './ActionItems/ActionSwitch';

export const All = () => (
  <ScreenWrapper>
    <ActionList>
      <ActionButton onPress={() => Alert.alert('ACTION!')}>
        ActionButton
      </ActionButton>
      <ActionButton Icon={ProfileIcon} onPress={() => Alert.alert('ACTION!')}>
        ActionButton with Icon
      </ActionButton>
      <ActionSwitch>ActionSwitch</ActionSwitch>
      <ActionSwitch Icon={ProfileIcon}>ActionSwitch with Icon</ActionSwitch>
      <ActionTextInput placeholder="ActionTextInput" />
    </ActionList>
  </ScreenWrapper>
);
