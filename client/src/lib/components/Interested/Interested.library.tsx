import React from 'react';
import ScreenWrapper from '../../uiLib/decorators/ScreenWrapper';
import {Spacer16} from '../Spacers/Spacer';
import {Heading16} from '../Typography/Heading/Heading';
import Interested from './Interested';

export const AllStates = () => (
  <ScreenWrapper>
    <Heading16>Default</Heading16>
    <Interested />
    <Spacer16 />

    <Heading16>Active</Heading16>
    <Interested active />
    <Spacer16 />

    <Heading16>Count</Heading16>
    <Interested count={10} />
    <Spacer16 />

    <Heading16>Count = 0</Heading16>
    <Interested count={0} />
    <Spacer16 />

    <Heading16>Reminder</Heading16>
    <Interested reminder />
    <Spacer16 />

    <Heading16>Active & reminder</Heading16>
    <Interested active reminder />
    <Spacer16 />

    <Heading16>Reminder & count</Heading16>
    <Interested active reminder count={10} />
    <Spacer16 />

    <Heading16>Reminder & count = 0</Heading16>
    <Interested active reminder count={0} />
    <Spacer16 />

    <Heading16>Compact</Heading16>
    <Interested compact />
    <Spacer16 />

    <Heading16>Compact & count = 0</Heading16>
    <Interested compact count={0} />
    <Spacer16 />

    <Heading16>Compact & count</Heading16>
    <Interested compact count={10} />
    <Spacer16 />

    <Heading16>Compact, reminder & count</Heading16>
    <Interested compact reminder count={10} />
    <Spacer16 />

    <Heading16>Compact, reminder & count = 0</Heading16>
    <Interested compact reminder count={0} />
    <Spacer16 />
  </ScreenWrapper>
);
