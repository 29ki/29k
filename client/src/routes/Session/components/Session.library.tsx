import React from 'react';
import styled from 'styled-components/native';

import {
  Spacer24,
  Spacer4,
  Spacer8,
} from '../../../lib/components/Spacers/Spacer';
import {
  Body14,
  Body16,
  BodyBold,
} from '../../../lib/components/Typography/Body/Body';
import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import AudioIndicator from './Participants/AudioIndicator';
import ProgressBar from './ProgressBar/ProgressBar';
import HostNotes from './HostNotes/HostNotes';
import Notification from './Notifications/Notification';

const Row = styled.View({flexDirection: 'row'});

export const UI = () => (
  <>
    <HostNotes />
    <ScreenWrapper>
      <Body14>
        <BodyBold>Progress bar</BodyBold>
      </Body14>
      <Spacer8 />
      <ProgressBar index={0} length={5} />
      <Spacer8 />
      <ProgressBar index={1} length={5} />
      <Spacer8 />
      <ProgressBar index={5} length={5} />
      <Spacer24 />
      <Body14>
        <BodyBold>Audio indicator</BodyBold>
      </Body14>
      <Spacer8 />
      <Row>
        <AudioIndicator muted />
        <Spacer8 />
        <AudioIndicator muted={false} />
      </Row>
      <Spacer24 />
      <Body16>
        <BodyBold>Session Notifications</BodyBold>
      </Body16>
      <Row>
        <Notification
          text="With image"
          letter="a"
          image="https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=1600"
        />
      </Row>
      <Spacer4 />
      <Row>
        <Notification text="Without image" letter="a" />
      </Row>
    </ScreenWrapper>
  </>
);
