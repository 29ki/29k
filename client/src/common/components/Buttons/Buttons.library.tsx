import React from 'react';
import styled from 'styled-components/native';

import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import {Spacer16} from '../Spacers/Spacer';

import Button from './Button';
import IconButton from './IconButton/IconButton';
import {HomeIcon} from '../Icons/Home/Home';
import {B2} from '../Typography/Text/Text';
import {PlusIcon} from '../Icons';

const Row = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const ButtonList = () => (
  <>
    <Button onPress={() => {}}>Primary</Button>
    <Spacer16 />
    <Button onPress={() => {}} small>
      Small
    </Button>
    <Spacer16 />
    <Button onPress={() => {}} LeftIcon={HomeIcon}>
      Left icon
    </Button>
    <Spacer16 />
    <Button onPress={() => {}} RightIcon={HomeIcon}>
      Right icon
    </Button>
    <Spacer16 />
    <Button onPress={() => {}} elevated>
      Elevated
    </Button>
    <Spacer16 />
    <Button onPress={() => {}} loading>
      Loading
    </Button>
    <Spacer16 />
    <Button onPress={() => {}} disabled>
      Disabled
    </Button>
    <Spacer16 />
    <Button onPress={() => {}} active>
      Active
    </Button>
    <Spacer16 />
    <Button onPress={() => {}} variant="secondary">
      Secondary
    </Button>
    <Spacer16 />
    <Button onPress={() => {}} variant="tertiary">
      Tertiary
    </Button>
    <Spacer16 />
  </>
);

const IconButtonList = () => (
  <>
    <Row>
      <B2>Icon button secondary</B2>
      <IconButton variant="secondary" onPress={() => {}} Icon={PlusIcon} />
    </Row>
    <Spacer16 />
    <Row>
      <B2>Icon button active state</B2>
      <IconButton onPress={() => {}} Icon={PlusIcon} active />
    </Row>
    <Spacer16 />
    <Row>
      <B2>Icon button tertiary elevated</B2>
      <IconButton
        elevated
        variant="tertiary"
        onPress={() => {}}
        Icon={PlusIcon}
      />
    </Row>
    <Spacer16 />
    <Row>
      <B2>Icon button elevated disabled</B2>
      <IconButton
        elevated
        variant="tertiary"
        disabled
        onPress={() => {}}
        Icon={PlusIcon}
      />
    </Row>
    <Spacer16 />
    <Row>
      <B2>Icon button small</B2>
      <IconButton small onPress={() => {}} Icon={PlusIcon} />
    </Row>
    <Spacer16 />
  </>
);

export const AllButtons = () => (
  <ScreenWrapper>
    <ButtonList />
    <IconButtonList />
  </ScreenWrapper>
);

export const Buttons = () => (
  <ScreenWrapper>
    <ButtonList />
  </ScreenWrapper>
);

export const IconButtons = () => (
  <ScreenWrapper>
    <IconButtonList />
  </ScreenWrapper>
);
