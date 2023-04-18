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

const NODE_TOP_MARGIN = 32;
const FULL_HEIGHT = 110;
const NODE_SIZE = 22;

type JourneyNodeProps = {
  completedSessionEvent: CompletedSessionEvent;
  index: number;
  isLast: boolean;
  isFirst: boolean;
};

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
});

const AnimatedContainer = styled(Animated.View)({});

const Container = styled(TouchableOpacity)<{isFirst: boolean}>(({isFirst}) => ({
  flexDirection: 'row',
  height: isFirst ? FULL_HEIGHT - NODE_TOP_MARGIN : FULL_HEIGHT,
  marginLeft: NODE_SIZE / 2,
}));

const ContentContainer = styled.View<{isFirst: boolean}>(({isFirst}) => ({
  marginTop: isFirst ? 0 : NODE_TOP_MARGIN,
  marginLeft: SPACINGS.FOUR,
  flex: 1,
}));

const Node = styled.View<{isFirst: boolean}>(({isFirst}) => ({
  marginLeft: -(NODE_SIZE / 2),
  height: NODE_SIZE,
  width: NODE_SIZE,
  border: 1,
  borderRadius: NODE_SIZE / 2,
  marginTop: isFirst ? 0 : NODE_TOP_MARGIN,
  backgroundColor: COLORS.WHITE,
  alignItems: 'center',
  justifyContent: 'center',
}));

const Line = styled.View<{isLast: boolean}>(({isLast}) => ({
  height: isLast ? NODE_TOP_MARGIN : FULL_HEIGHT,
  width: 1,
  backgroundColor: COLORS.BLACK,
  position: 'absolute',
  left: -1,
}));

const InnerNode = styled.View({
  height: 14,
  width: 14,
  borderRadius: 14 / 2,
  backgroundColor: COLORS.MEDIUM_GREEN,
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
  isLast = false,
  isFirst = false,
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
      <Container isFirst={isFirst} onPress={openCompleteSessionModal}>
        <Line isLast={isLast} />
        <Node isFirst={isFirst}>
          <InnerNode />
        </Node>
        <ContentContainer isFirst={isFirst}>
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
                  hostProfile?.photoURL ?? exercise?.card?.host?.photoURL
                }
                name={
                  hostProfile?.displayName ?? exercise?.card?.host?.displayName
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
