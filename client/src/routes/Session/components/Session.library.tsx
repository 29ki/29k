import React from 'react';
import styled from 'styled-components/native';

import {
  Spacer24,
  Spacer4,
  Spacer8,
} from '../../../common/components/Spacers/Spacer';
import {
  Body14,
  Body16,
  BodyBold,
} from '../../../common/components/Typography/Body/Body';
import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import AudioIndicator from './Participants/AudioIdicator';
import ProgressBar from './ProgressBar/ProgressBar';
import HostNotes from './HostNotes/HostNotes';
import {Notification} from './Notifications/Notification';
import Byline from '../../../common/components/Bylines/Byline';

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
      <Spacer4 />
      <Row>
        <Notification timeVisible={5000} text="With custom timing" letter="a" />
      </Row>
      <Spacer4 />
      <Row>
        <Notification visible text="Always visible" letter="a" />
      </Row>
      <Spacer24 />
      <Body16>
        <BodyBold>Byline</BodyBold>
      </Body16>
      <Spacer8 />
      <Byline
        pictureURL="https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=1600"
        name="Pär-Ulrik Os"
      />
      <Spacer24 />
    </ScreenWrapper>
  </>
);
