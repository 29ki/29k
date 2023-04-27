import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import apiClient from '../../../../lib/apiClient/apiClient';
import {LiveSessionType} from '../../../../../../shared/src/schemas/Session';
import SessionCard from '../../../../lib/components/Cards/SessionCard/SessionCard';
import styled from 'styled-components/native';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Heading from './Heading';
import {Spacer28} from '../../../../lib/components/Spacers/Spacer';
import getFallbackSessions from './fallbackSessions';

const Cards = styled(Animated.View)({
  flex: 1,
  width: '90%',
  alignSelf: 'center',
  zIndex: 1,
});

const Card = styled(Animated.View).attrs({pointerEvents: 'none'})({
  position: 'absolute',
  bottom: 0,
});

const StyledSessionCard = styled(SessionCard)({
  shadowColor: '#000',
  shadowOffset: '0 12px',
  shadowOpacity: 0.58,
  shadowRadius: 16.0,
  elevation: 24,
});

type AnimatedCardProps = {
  index: number;
  count: number;
  children: React.ReactNode;
};
const AnimatedCard: React.FC<AnimatedCardProps> = ({
  index,
  count,
  children,
}) => {
  const scale = useSharedValue(0.75 - (count - (index + 1)) * 0.11);
  const translateY = useSharedValue(-100 - (count - (index + 1)) * 50);

  useEffect(() => {
    scale.value = withDelay(
      1000 * index,
      withTiming(1 - (count - (index + 1)) * 0.11, {
        duration: 8000 - 1000 * index,
      }),
    );

    translateY.value = withDelay(
      1000 * index,
      withTiming(-((count - (index + 1)) * 120), {
        duration: 8000 - 1000 * index,
      }),
    );
  }, [scale, translateY, count, index]);

  const style = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}, {scale: scale.value}],
  }));

  return <Card style={style}>{children}</Card>;
};

const Page1 = () => {
  const {t} = useTranslation('Screen.Onboarding');
  const opacity = useSharedValue(0);
  const [sessions, setSessions] = useState<LiveSessionType[]>(
    getFallbackSessions(),
  );

  useEffect(() => {
    apiClient('onboarding/sessions?limit=3', undefined, false)
      .then(response => response.json())
      .then(response => {
        if (response && response.length) {
          setSessions(response.reverse());
        }
      })
      .finally(() => {
        opacity.value = withTiming(1, {duration: 1000});
      });
  }, [opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <>
      <Cards style={style}>
        {sessions.map((session, index) => (
          <AnimatedCard index={index} count={sessions.length} key={index}>
            <StyledSessionCard session={session} />
          </AnimatedCard>
        ))}
      </Cards>
      <Spacer28 />
      <Gutters>
        <Heading>{t('page1.heading__text')}</Heading>
      </Gutters>
    </>
  );
};

export default Page1;
