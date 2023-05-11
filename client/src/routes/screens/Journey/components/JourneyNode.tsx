import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import AnimatedLottieView from 'lottie-react-native';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';

import {CompletedSessionEvent} from '../../../../../../shared/src/types/Event';
import {
  SessionMode,
  SessionType,
} from '../../../../../../shared/src/schemas/Session';
import Badge from '../../../../lib/components/Badge/Badge';
import Byline from '../../../../lib/components/Bylines/Byline';
import {
  CommunityIcon,
  FriendsIcon,
  MeIcon,
} from '../../../../lib/components/Icons';
import Image from '../../../../lib/components/Image/Image';
import {
  Spacer16,
  Spacer4,
  Spacer8,
} from '../../../../lib/components/Spacers/Spacer';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {Display16} from '../../../../lib/components/Typography/Display/Display';
import {SPACINGS} from '../../../../lib/constants/spacings';
import useExerciseById from '../../../../lib/content/hooks/useExerciseById';
import {ModalStackProps} from '../../../../lib/navigation/constants/routes';
import useUserProfile from '../../../../lib/user/hooks/useUserProfile';
import Node from '../../../../lib/components/Node/Node';
import useGetFeedbackBySessionId from '../../../../lib/user/hooks/useGetFeedbackBySessionId';
import {
  ThumbsUpWithoutPadding,
  ThumbsDownWithoutPadding,
} from '../../../../lib/components/Thumbs/Thumbs';

export const HEIGHT = 100;
const NODE_SIZE = 22;

type JourneyNodeProps = {
  completedSessionEvent: CompletedSessionEvent;
  isFirst: boolean;
  isLast: boolean;
};

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
});

const Container = styled(TouchableOpacity)<Pick<JourneyNodeProps, 'isFirst'>>(
  ({isFirst}) => ({
    flexDirection: 'row',
    height: HEIGHT,
    marginBottom: isFirst ? -SPACINGS.FOUR : 0,
    overflow: 'visible',
  }),
);

const ContentContainer = styled.View<Pick<JourneyNodeProps, 'isFirst'>>({
  marginLeft: SPACINGS.FOUR,
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Line = styled.View<Pick<JourneyNodeProps, 'isLast' | 'isFirst'>>(
  ({isLast, isFirst}) => ({
    position: 'absolute',
    left: NODE_SIZE / 2,
    width: 1,
    height: isLast ? SPACINGS.SIXTEEN : HEIGHT,
    backgroundColor: COLORS.BLACK,
    marginTop: isFirst ? SPACINGS.SIXTEEN : 0,
  }),
);

const GraphicsWrapper = styled.View({
  width: 88,
  height: 88,
  overflow: 'visible',
});

const StatusRow = styled.View({
  flexDirection: 'row',
});

const Spacer2 = styled.View({height: 2});

const ThumbsUp = styled(ThumbsUpWithoutPadding)({
  position: 'static',
  width: 22,
  aspectRatio: 1,
});

const ThumbsDown = styled(ThumbsDownWithoutPadding)({
  position: 'static',
  width: 22,
  aspectRatio: 1,
});

const NodeContainer = styled.View<{isFirst: boolean}>({
  marginTop: 15,
});

const JourneyNode: React.FC<JourneyNodeProps> = ({
  completedSessionEvent,
  isFirst = false,
  isLast = false,
}) => {
  const {
    payload: {id, mode, exerciseId, hostId, type},
    timestamp,
  } = completedSessionEvent;
  const exercise = useExerciseById(exerciseId);
  const hostProfile = useUserProfile(hostId);
  const getFeedbackBySessionId = useGetFeedbackBySessionId();

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

  const feedback = useMemo(
    () => getFeedbackBySessionId(id),
    [id, getFeedbackBySessionId],
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
    <Container onPress={openCompleteSessionModal} isFirst={isFirst}>
      <Line isLast={isLast} isFirst={isFirst} />
      <NodeContainer isFirst={isFirst}>
        <Node size={NODE_SIZE} />
      </NodeContainer>
      <ContentContainer isFirst={isFirst}>
        <View>
          <StatusRow>
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
            <Spacer4 />
            {feedback &&
              (feedback.payload.answer ? <ThumbsUp /> : <ThumbsDown />)}
          </StatusRow>
          <Spacer8 />
          {exercise?.name && (
            <Display16 numberOfLines={1}>{exercise.name}</Display16>
          )}
          <Spacer2 />
          {!hostProfile?.photoURL && !exercise?.card?.host?.photoURL && (
            <Spacer16 />
          )}
          <Byline
            small
            pictureURL={hostProfile?.photoURL ?? exercise?.card?.host?.photoURL}
            name={hostProfile?.displayName ?? exercise?.card?.host?.displayName}
          />
        </View>
        <GraphicsWrapper>
          {lottie ? (
            <Lottie source={lottie} autoPlay loop />
          ) : image ? (
            <Image resizeMode="contain" source={image} />
          ) : null}
        </GraphicsWrapper>
      </ContentContainer>
    </Container>
  );
};

export default JourneyNode;
