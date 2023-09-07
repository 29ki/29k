import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Screen from '../../../../../lib/components/Screen/Screen';
import {
  Body16,
  BodyBold,
} from '../../../../../lib/components/Typography/Body/Body';
import {
  BottomSafeArea,
  Spacer16,
  Spacer32,
  Spacer60,
  TopSafeArea,
} from '../../../../../lib/components/Spacers/Spacer';
import Button from '../../../../../lib/components/Buttons/Button';
import useLiveSessionMetricEvents from '../../../../../lib/session/hooks/useLiveSessionMetricEvents';
import {
  HeadphonesIcon,
  LogoIconAnimated,
  SparklesIcon,
} from '../../../../../lib/components/Icons';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../shared/src/constants/colors';
import {Display22} from '../../../../../lib/components/Typography/Display/Display';
import AutoScrollView from '../../../../../lib/components/AutoScrollView/AutoScrollView';
import DescriptionBlock from '../../../../../lib/components/DescriptionBlock/DescriptionBlock';
import Gutters from '../../../../../lib/components/Gutters/Gutters';

const Content = styled(AutoScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
  },
})({});

const LogoWrapper = styled.View({
  width: 116,
  height: 116,
});

const Center = styled.View({
  alignItems: 'center',
});

type SessionOnboardingProps = {
  onHideOnboarding: () => {};
};
const SessionOnboarding: React.FC<SessionOnboardingProps> = ({
  onHideOnboarding,
}) => {
  const {goBack} = useNavigation();

  const logSessionMetricEvent = useLiveSessionMetricEvents();

  useEffect(() => {
    logSessionMetricEvent('Enter Sharing Session Onboarding');
  }, [logSessionMetricEvent]);

  return (
    <Screen onPressBack={goBack}>
      <Content>
        <Gutters>
          <TopSafeArea />
          <Spacer32 />
          <Center>
            <LogoWrapper>
              <LogoIconAnimated fill={COLORS.PRIMARY} />
            </LogoWrapper>
            <Spacer60 />
            <Display22>Let's get ready for this session</Display22>
            <Spacer32 />
          </Center>
          <DescriptionBlock Icon={SparklesIcon}>
            <Body16>
              This session is a live video call. You can listen in, or share
              your experience with the group.
            </Body16>
          </DescriptionBlock>
          <Spacer16 />
          <DescriptionBlock Icon={HeadphonesIcon}>
            <Body16>Use a headset and find a comfortable, calm space.</Body16>
          </DescriptionBlock>
          <Spacer16 />
          <DescriptionBlock Icon={Camera}>
            <Body16>Use a headset and find a comfortable, calm space.</Body16>
          </DescriptionBlock>
          <Spacer32 />
          <Center>
            <Button onPress={onHideOnboarding} variant="secondary">
              <BodyBold>Got it</BodyBold>
            </Button>
          </Center>
          <Spacer32 />
          <BottomSafeArea />
        </Gutters>
      </Content>
    </Screen>
  );
};

export default SessionOnboarding;
