import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import AnimatedLottieView from 'lottie-react-native';
import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components/native';
import Animated, {FadeIn, FadeOut, Layout} from 'react-native-reanimated';

import {COLORS} from '../../../../../../shared/src/constants/colors';

import {CompletedSessionEvent} from '../../../../../../shared/src/types/Event';
import {
  SessionMode,
  SessionType,
} from '../../../../../../shared/src/types/Session';
import Badge from '../../../../lib/components/Badge/Badge';
import Byline from '../../../../lib/components/Bylines/Byline';
import {
  CommunityIcon,
  FriendsIcon,
  MeIcon,
} from '../../../../lib/components/Icons';
import Image from '../../../../lib/components/Image/Image';
import {Spacer8} from '../../../../lib/components/Spacers/Spacer';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {Display16} from '../../../../lib/components/Typography/Display/Display';
import {SPACINGS} from '../../../../lib/constants/spacings';
import useExerciseById from '../../../../lib/content/hooks/useExerciseById';
import {ModalStackProps} from '../../../../lib/navigation/constants/routes';
import useUserProfile from '../../../../lib/user/hooks/useUserProfile';

type JourneyNodeProps = {
  completedSessionEvent: CompletedSessionEvent;
  index: number;
};

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
});

const AnimatedContainer = styled(Animated.View)({});

const Container = styled(TouchableOpacity)({
  flexDirection: 'row',
  borderLeft: 1,
  borderLeftWidth: 1,
  height: 110,
  marginLeft: 22 / 2,
});

const ContentContainer = styled.View({
  marginTop: 32,
  marginLeft: SPACINGS.FOUR,
  flex: 1,
});

const Node = styled.View({
  marginLeft: -(22 / 2),
  height: 22,
  width: 22,
  border: 1,
  borderRadius: 22 / 2,
  marginTop: 32,
  backgroundColor: COLORS.WHITE,
  alignItems: 'center',
  justifyContent: 'center',
});

const InnerNode = styled.View({
  height: 14,
  width: 14,
  borderRadius: 14 / 2,
  backgroundColor: '#A9DAC0',
});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const GraphicsWrapper = styled.View({
  width: 80,
  height: 80,
  marginVertical: SPACINGS.EIGHT,
  marginHorizontal: SPACINGS.SIXTEEN,
});

const Column = styled.View({});

const Spacer2 = styled.View({height: 2});

const JourneyNode: React.FC<JourneyNodeProps> = ({
  completedSessionEvent,
  index,
}) => {
  const {
    payload: {mode, exerciseId, hostId, type},
    timestamp,
  } = completedSessionEvent;
  const exercise = useExerciseById(exerciseId);
  const hostProfile = useUserProfile(hostId);

  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<ModalStackProps, 'CompletedSessionModal'>
    >();

  const openCompleteSessionModal = useCallback(
    () =>
      navigate('CompletedSessionModal', {
        completedSessionEvent,
      }),
    [navigate, completedSessionEvent],
  );

  const image = useMemo(
    () => ({
      uri: exercise?.card?.image?.source,
    }),
    [exercise],
  );

  const lottie = useMemo(
    () =>
      exercise?.card?.lottie?.source
        ? {
            uri: exercise?.card?.lottie?.source,
          }
        : undefined,
    [exercise],
  );

  return (
    <AnimatedContainer
      layout={Layout.springify()}
      entering={FadeIn.delay(index * 100)}
      exiting={FadeOut}>
      <Container onPress={openCompleteSessionModal}>
        <Node>
          <InnerNode />
        </Node>
        <ContentContainer>
          <Row>
            <Column>
              <Row>
                <Badge
                  text={dayjs(timestamp).format('ddd, D MMM HH:mm')}
                  IconAfter={
                    mode === SessionMode.async ? (
                      <MeIcon />
                    ) : type === SessionType.private ? (
                      <FriendsIcon />
                    ) : (
                      <CommunityIcon />
                    )
                  }
                  completed
                />
              </Row>
              <Spacer8 />
              {exercise?.name && (
                <Display16 numberOfLines={1}>{exercise.name}</Display16>
              )}
              <Spacer2 />
              <Byline
                small
                pictureURL={
                  hostProfile.photoURL ?? exercise?.card?.host?.photoURL
                }
                name={
                  hostProfile.displayName ?? exercise?.card?.host?.displayName
                }
              />
            </Column>
            <GraphicsWrapper>
              {lottie ? (
                <Lottie source={lottie} autoPlay loop />
              ) : image ? (
                <Image resizeMode="contain" source={image} />
              ) : null}
            </GraphicsWrapper>
          </Row>
        </ContentContainer>
      </Container>
    </AnimatedContainer>
  );
};

export default JourneyNode;
