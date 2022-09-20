import React from 'react';
import styled from 'styled-components/native';

import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import {Spacer16} from '../Spacers/Spacer';

import Button from './Button';
import IconButton from './IconButton/IconButton';
import {HomeIcon} from '../Icons/Home/Home';
import {B2} from '../Typography/Text/Text';

const Row = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const AllButtons = () => (
  <ScreenWrapper>
    <Buttons />
    <IconButtons />
  </ScreenWrapper>
);

export const Buttons = () => (
  <ScreenWrapper>
    <Button>Primary</Button>
    <Spacer16 />
    <Button small>Small</Button>
    <Spacer16 />
    <Button LeftIcon={HomeIcon}>Left icon</Button>
    <Spacer16 />
    <Button RightIcon={HomeIcon}>Right icon</Button>
    <Spacer16 />
    <Button elevated>Elevated</Button>
    <Spacer16 />
    <Button loading>Loading</Button>
    <Spacer16 />
    <Button disabled>Disabled</Button>
    <Spacer16 />
    <Button active>Active</Button>
    <Spacer16 />
    <Button variant="secondary">Secondary</Button>
    <Spacer16 />
    <Button variant="tertiary">Tertiary</Button>
    <Spacer16 />
  </ScreenWrapper>
);

export const IconButtons = () => (
  <ScreenWrapper>
    <Row>
      <B2>Icon button</B2>
      <IconButton Icon={HomeIcon} />
    </Row>
    <Spacer16 />
    <Row>
      <B2>Icon button active state</B2>
      <IconButton Icon={HomeIcon} active={false} />
    </Row>
  </ScreenWrapper>
);
