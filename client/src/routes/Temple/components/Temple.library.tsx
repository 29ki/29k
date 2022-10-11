import dayjs from 'dayjs';
import React from 'react';
import styled from 'styled-components/native';

import {Spacer16, Spacer8} from '../../../common/components/Spacers/Spacer';
import {Body14} from '../../../common/components/Typography/Body/Body';
import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import Counter from './Counter/Counter';
import AudioIndicator from './Participants/AudioIdicator';
import ProgressBar from './ProgressBar/ProgressBar';
import HostNotes from './HostNotes/HostNotes';
import {COLORS} from '../../../../../shared/src/constants/colors';

const dayjsTime = dayjs().add(59, 'minutes');

const Row = styled.View({flexDirection: 'row'});
const ColorBG = styled.View({backgroundColor: COLORS.GREYDARK, padding: 4});

export const UI = () => (
  <ScreenWrapper>
    <Body14>Progress bar</Body14>
    <Spacer8 />
    <ProgressBar index={0} length={5} />
    <Spacer8 />
    <ProgressBar index={1} length={5} />
    <Spacer8 />
    <ProgressBar index={5} length={5} />
    <Spacer16 />
    <Body14>Audio indicator</Body14>
    <Spacer8 />
    <Row>
      <AudioIndicator muted />
      <Spacer8 />
      <AudioIndicator muted={false} />
    </Row>
    <Spacer16 />
    <Body14>Counter</Body14>
    <Spacer8 />
    <ColorBG>
      <Row>
        <Counter startTime={dayjsTime} starting={false} />
        <Spacer8 />
        <Counter startTime={dayjsTime} starting={true} />
        <Spacer8 />
      </Row>
    </ColorBG>
  </ScreenWrapper>
);

export const Notes = () => (
  <>
    <HostNotes />
  </>
);
