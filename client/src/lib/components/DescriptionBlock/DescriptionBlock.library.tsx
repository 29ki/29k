import React from 'react';
import ScreenWrapper from '../../uiLib/decorators/ScreenWrapper';
import {LogoIcon} from '../Icons';
import {Spacer16, Spacer8} from '../Spacers/Spacer';
import {Heading16} from '../Typography/Heading/Heading';
import DescriptionBlock from './DescriptionBlock';
import {Body16} from '../Typography/Body/Body';

export const AllTypes = () => (
  <ScreenWrapper>
    <Heading16>DescriptionBlock</Heading16>
    <Spacer8 />
    <DescriptionBlock>
      <Body16>Without icon</Body16>
    </DescriptionBlock>
    <Spacer16 />
    <DescriptionBlock>
      <Body16>
        Without icon and very very very very very very very very very very very
        very very very long text
      </Body16>
    </DescriptionBlock>
    <Spacer16 />

    <DescriptionBlock Icon={LogoIcon}>
      <Body16>With icon</Body16>
    </DescriptionBlock>
    <Spacer16 />
    <DescriptionBlock Icon={LogoIcon}>
      <Body16>
        With icon and very very very very very very very very very very very
        very very very long text
      </Body16>
    </DescriptionBlock>
    <Spacer16 />

    <DescriptionBlock transparent>
      <Body16>Transparent without icon</Body16>
    </DescriptionBlock>
    <Spacer16 />
    <DescriptionBlock Icon={LogoIcon} transparent>
      <Body16>Transparent with icon</Body16>
    </DescriptionBlock>
  </ScreenWrapper>
);
