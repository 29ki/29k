import React from 'react';

import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import {Spacer16} from '../Spacers/Spacer';

import Button from './Button';
import IconButton from './IconButton/IconButton';
import {HomeIcon} from '../Icons/Home/Home';
import styled from 'styled-components';

export const AllButtons = () => (
  <ScreenWrapper>
    <Button>Regular button</Button>
    <IconButton Icon={HomeIcon} fill="black" />
  </ScreenWrapper>
);

export const Buttons = () => (
  <ScreenWrapper>
    <Button>Regular button</Button>
    <Spacer16 />
    <Button primary>Primary button</Button>
  </ScreenWrapper>
);

const IconButtonBlack = styled(IconButton)({
  backgroundColor: 'black',
});

export const IconButtons = () => (
  <ScreenWrapper>
    <IconButton Icon={HomeIcon} fill="black" />
    <Spacer16 />
    <IconButtonBlack Icon={HomeIcon} fill="white" />
  </ScreenWrapper>
);
