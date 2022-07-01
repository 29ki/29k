import React from 'react';
import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import {H1, H2, H3, H4} from './Heading/Heading';
import {B1, B2, B3} from './Text/Text';

export const AllTypes = () => (
  <ScreenWrapper>
    <H1>Heading 1</H1>
    <H2>Heading 2</H2>
    <H3>Heading 3</H3>
    <H4>Heading 4</H4>
    <B1>Body 1</B1>
    <B2>Body 2</B2>
    <B3>Body 3</B3>
  </ScreenWrapper>
);
export const Headings = () => (
  <ScreenWrapper>
    <H1>Heading 1</H1>
    <H2>Heading 2</H2>
    <H3>Heading 3</H3>
    <H4>Heading 4</H4>
  </ScreenWrapper>
);
export const Bodies = () => (
  <ScreenWrapper>
    <B1>Body 1</B1>
    <B2>Body 2</B2>
    <B3>Body 3</B3>
  </ScreenWrapper>
);
