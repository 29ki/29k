import React from 'react';
import {Spacer48, Spacer96} from '../Spacers/Spacer';
import BackgroundBlock from './BackgroundBlock';
import {COLORS} from '../../../../../shared/src/constants/colors';
import styled from 'styled-components/native';
import {Heading24} from '../Typography/Heading/Heading';

const Wrapper = styled.View({
  flex: 1,
  backgroundColor: COLORS.BLACK,
});

export const AllTypes = () => (
  <Wrapper>
    <Spacer96 />

    <BackgroundBlock backgroundColor={COLORS.PURE_WHITE}>
      <Heading24>Test test</Heading24>
    </BackgroundBlock>
    <Spacer48 />

    <BackgroundBlock backgroundColor={COLORS.PURE_WHITE}>
      <Spacer96 />
      <Heading24>Test test</Heading24>
      <Spacer96 />
    </BackgroundBlock>
    <Spacer48 />

    <BackgroundBlock backgroundColor={COLORS.ERROR}>
      <Spacer96 />
      <Heading24>Test test</Heading24>
      <Spacer96 />
    </BackgroundBlock>
  </Wrapper>
);
