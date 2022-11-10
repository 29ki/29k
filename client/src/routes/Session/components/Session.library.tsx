import dayjs from 'dayjs';
import React from 'react';
import styled from 'styled-components/native';

import {Spacer24, Spacer8} from '../../../common/components/Spacers/Spacer';
import {
  Body14,
  Body16,
  BodyBold,
} from '../../../common/components/Typography/Body/Body';
import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import Counter from './Counter/Counter';
import AudioIndicator from './Participants/AudioIdicator';
import ProgressBar from './ProgressBar/ProgressBar';
import HostNotes from './HostNotes/HostNotes';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SessionNotification} from './SessionNotifications';
import {View} from 'react-native';

const dayjsTime = dayjs().add(59, 'minutes');

const Row = styled.View({flexDirection: 'row'});
const ColorBG = styled.View({
  backgroundColor: COLORS.BLACK_TRANSPARENT_15,
  padding: 4,
});

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
      <Body14>
        <BodyBold>Counter</BodyBold>
      </Body14>
      <Spacer8 />
      <ColorBG>
        <Row>
          <Body14>
            <Counter startTime={dayjsTime} />
          </Body14>
          <Spacer8 />
          <Body14>
            <Counter startTime={dayjsTime} />
          </Body14>
          <Spacer8 />
        </Row>
      </ColorBG>
      <Spacer24 />
      <Body16>
        <BodyBold>Session Notifications</BodyBold>
      </Body16>
      <Row>
        <View>
          <Body14>With image</Body14>
          <SessionNotification
            uilib
            text="Skinkan joined"
            letter="a"
            image="https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=1600"
          />
        </View>
        <Spacer8 />
        <View>
          <Body14>Without image</Body14>
          <SessionNotification uilib text="Osten left" letter="a" />
        </View>
      </Row>
    </ScreenWrapper>
  </>
);
