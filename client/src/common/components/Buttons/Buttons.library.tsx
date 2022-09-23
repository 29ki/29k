import React from 'react';
import styled from 'styled-components/native';

import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import {Spacer16} from '../Spacers/Spacer';

import Button from './Button';
import IconButton from './IconButton/IconButton';
import {HomeIcon} from '../Icons/Home/Home';
import {B1, B2} from '../Typography/Text/Text';
import {PlusIcon} from '../Icons';

const RowFullWidth = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Row = styled.View({flexDirection: 'row'});

export const AllButtons = () => (
  <ScreenWrapper>
    <Buttons />
    <IconButtons />
  </ScreenWrapper>
);

export const Buttons = () => (
  <ScreenWrapper>
    <RowFullWidth>
      <Button onPress={() => {}}>Primary</Button>
      <Spacer16 />
      <Button loading elevated onPress={() => {}}>
        Elevated Loading
      </Button>
    </RowFullWidth>
    <Spacer16 />
    <RowFullWidth>
      <Button onPress={() => {}} variant="secondary">
        Secondary
      </Button>
      <Spacer16 />
      <Button variant="secondary" elevated onPress={() => {}}>
        Elevated Secondary
      </Button>
    </RowFullWidth>
    <Spacer16 />
    <RowFullWidth>
      <Button onPress={() => {}} variant="tertiary">
        Tertiary
      </Button>
      <Spacer16 />
      <Button variant="tertiary" elevated onPress={() => {}}>
        Elevated Tertiary
      </Button>
    </RowFullWidth>
    <Spacer16 />
    <RowFullWidth>
      <Button onPress={() => {}} LeftIcon={HomeIcon}>
        Left icon
      </Button>
      <Spacer16 />
      <Button onPress={() => {}} RightIcon={HomeIcon}>
        Right icon
      </Button>
    </RowFullWidth>
    <Spacer16 />
    <RowFullWidth>
      <Button small onPress={() => {}}>
        Small Button
      </Button>
      <Spacer16 />
      <Button small onPress={() => {}} LeftIcon={HomeIcon}>
        Small with icon
      </Button>
    </RowFullWidth>
    <Spacer16 />
    <RowFullWidth>
      <Button onPress={() => {}} disabled>
        Disabled
      </Button>
      <Spacer16 />
      <Button onPress={() => {}} active>
        Active
      </Button>
    </RowFullWidth>
    <Spacer16 />
  </ScreenWrapper>
);

export const IconButtons = () => (
  <ScreenWrapper>
    <B1>Icon buttons</B1>
    <RowFullWidth>
      <B2>Primary</B2>
      <Row>
        <IconButton onPress={() => {}} Icon={PlusIcon} />
        <Spacer16 />
        <IconButton elevated onPress={() => {}} Icon={PlusIcon} />
      </Row>
    </RowFullWidth>
    <Spacer16 />
    <RowFullWidth>
      <B2>Secondary</B2>
      <Row>
        <IconButton variant="secondary" onPress={() => {}} Icon={PlusIcon} />
        <Spacer16 />
        <IconButton
          variant="secondary"
          elevated
          onPress={() => {}}
          Icon={PlusIcon}
        />
      </Row>
    </RowFullWidth>
    <Spacer16 />
    <RowFullWidth>
      <B2>Tertiary</B2>
      <Row>
        <IconButton variant="tertiary" onPress={() => {}} Icon={PlusIcon} />
        <Spacer16 />
        <IconButton
          variant="tertiary"
          elevated
          onPress={() => {}}
          Icon={PlusIcon}
        />
      </Row>
    </RowFullWidth>
    <Spacer16 />
    <RowFullWidth>
      <B2>Active and disabled</B2>
      <Row>
        <IconButton onPress={() => {}} Icon={PlusIcon} active />
        <Spacer16 />
        <IconButton
          elevated
          variant="tertiary"
          disabled
          onPress={() => {}}
          Icon={PlusIcon}
        />
      </Row>
    </RowFullWidth>
    <Spacer16 />
    <RowFullWidth>
      <B2>Small</B2>
      <IconButton small onPress={() => {}} Icon={PlusIcon} />
    </RowFullWidth>
    <Spacer16 />
  </ScreenWrapper>
);
