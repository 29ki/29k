import React from 'react';
import ScreenWrapper from '../../uiLib/decorators/ScreenWrapper';
import ActionButton from './ActionItems/ActionButton';
import ActionList from './ActionList';
import {ProfileIcon} from '../Icons';
import {ActivityIndicator, Alert} from 'react-native';
import ActionTextInput from './ActionItems/ActionTextInput';
import ActionSwitch from './ActionItems/ActionSwitch';
import {Spacer32, Spacer8} from '../Spacers/Spacer';
import ActionRadioButton from './ActionItems/ActionRadioButton';
import {Heading16} from '../Typography/Heading/Heading';

const Spinner = () => <ActivityIndicator size="small" />;

export const AllTypes = () => (
  <ScreenWrapper>
    <Heading16>ActionButton</Heading16>
    <Spacer8 />
    <ActionList>
      <ActionButton onPress={() => Alert.alert('ACTION!')}>
        ActionButton
      </ActionButton>
      <ActionButton onPress={() => Alert.alert('ACTION!')}>
        ActionButton with very very very very very long text
      </ActionButton>
      <ActionButton Icon={ProfileIcon} onPress={() => Alert.alert('ACTION!')}>
        ActionButton with Icon
      </ActionButton>
      <ActionButton Icon={ProfileIcon} onPress={() => Alert.alert('ACTION!')}>
        ActionButton with Icon and very very very very very long text
      </ActionButton>
      <ActionButton Icon={Spinner} onPress={() => Alert.alert('ACTION!')}>
        ActionButton with ActivityIndicator
      </ActionButton>
    </ActionList>
    <Spacer32 />

    <Heading16>ActionTextInput</Heading16>
    <Spacer8 />
    <ActionList>
      <ActionTextInput placeholder="ActionTextInput placeholder" />
      <ActionTextInput value="ActionTextInput prefilled value" />
      <ActionTextInput value="ActionTextInput with very very very very very very very very very very very long text" />
      <ActionTextInput
        placeholder="ActionTextInput placeholder with error"
        hasError
      />
      <ActionTextInput
        value="ActionTextInput prefilled value with error"
        hasError
      />
    </ActionList>
    <Spacer32 />

    <Heading16>ActionRadioButton</Heading16>
    <Spacer8 />
    <ActionList>
      <ActionRadioButton onPress={() => Alert.alert('ACTION!')}>
        ActionRadioButton unchecked
      </ActionRadioButton>
      <ActionRadioButton checked onPress={() => Alert.alert('ACTION!')}>
        ActionRadioButton checked
      </ActionRadioButton>
      <ActionRadioButton checked onPress={() => Alert.alert('ACTION!')}>
        ActionRadioButton checked with very very very very very very very very
        very very very long text
      </ActionRadioButton>
      <ActionRadioButton
        Icon={ProfileIcon}
        onPress={() => Alert.alert('ACTION!')}>
        ActionRadioButton with Icon unchecked
      </ActionRadioButton>
      <ActionRadioButton
        Icon={ProfileIcon}
        checked
        onPress={() => Alert.alert('ACTION!')}>
        ActionRadioButton with Icon checked
      </ActionRadioButton>
      <ActionRadioButton
        Icon={ProfileIcon}
        checked
        onPress={() => Alert.alert('ACTION!')}>
        ActionRadioButton with Icon checked and with very very very very very
        very very very very very very long text
      </ActionRadioButton>
      <ActionRadioButton
        Icon={Spinner}
        checked
        onPress={() => Alert.alert('ACTION!')}>
        ActionRadioButton with ActivityIndicator
      </ActionRadioButton>
    </ActionList>
    <Spacer32 />

    <Heading16>ActionSwitch</Heading16>
    <Spacer8 />
    <ActionList>
      <ActionSwitch>ActionSwitch</ActionSwitch>
      <ActionSwitch value={true}>ActionSwitch</ActionSwitch>
      <ActionSwitch>
        ActionSwitch with very very very very very long text
      </ActionSwitch>
      <ActionSwitch Icon={ProfileIcon}>ActionSwitch with Icon</ActionSwitch>
      <ActionSwitch Icon={ProfileIcon}>
        ActionSwitch with Icon and very very very very very long text
      </ActionSwitch>
      <ActionSwitch Icon={Spinner}>
        ActionSwitch with ActivityIndicator
      </ActionSwitch>
    </ActionList>
  </ScreenWrapper>
);
