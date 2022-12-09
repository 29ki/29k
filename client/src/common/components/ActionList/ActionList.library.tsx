import React from 'react';
import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import ActionButton from './ActionItems/ActionButton';
import ActionList from './ActionList';
import {ProfileIcon} from '../Icons';
import {Alert} from 'react-native';
import ActionTextInput from './ActionItems/ActionTextInput';
import ActionSwitch from './ActionItems/ActionSwitch';
import {Body16, BodyBold} from '../Typography/Body/Body';
import {Spacer32, Spacer8} from '../Spacers/Spacer';
import ActionRadioButton from './ActionItems/ActionRadioButton';

export const All = () => (
  <ScreenWrapper>
    <Body16>
      <BodyBold>ActionButton</BodyBold>
    </Body16>
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
    </ActionList>
    <Spacer32 />

    <Body16>
      <BodyBold>ActionTextInput</BodyBold>
    </Body16>
    <Spacer8 />
    <ActionList>
      <ActionTextInput placeholder="ActionTextInput placeholder" />
      <ActionTextInput value="ActionTextInput prefilled value" />
      <ActionTextInput value="ActionTextInput with very very very very very very very very very very very long text" />
    </ActionList>
    <Spacer32 />

    <Body16>
      <BodyBold>ActionRadioButton</BodyBold>
    </Body16>
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
    </ActionList>
    <Spacer32 />

    <Body16>
      <BodyBold>ActionSwitch</BodyBold>
    </Body16>
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
    </ActionList>
  </ScreenWrapper>
);
