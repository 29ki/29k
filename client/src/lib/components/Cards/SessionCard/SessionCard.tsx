import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import dayjs from 'dayjs';

import {Session} from '../../../../../../shared/src/types/Session';

import {formatExerciseName} from '../../../utils/string';

import useExerciseById from '../../../content/hooks/useExerciseById';
import useSessionStartTime from '../../../session/hooks/useSessionStartTime';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../navigation/constants/routes';

import Card from '../Card';
import WalletCard from '../WalletCard';
import SessionTimeBadge from '../../SessionTimeBadge/SessionTimeBadge';
import usePinnedSessons from '../../../sessions/hooks/usePinnedSessions';
import useLogSessionMetricEvents from '../../../sessions/hooks/useLogSessionMetricEvents';
import useGetSessionCardTags from './hooks/useGetSessionCardTags';
import Button from '../../Buttons/Button';
import {Spacer4, Spacer8} from '../../Spacers/Spacer';
import useUser from '../../../user/hooks/useUser';
import InterestedBadge from '../../InterestedBadge/InterestedBadge';
import Interested from '../../Interested/Interested';

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-end',
});

const InterestedWrapper = styled.View({
  flexDirection: 'row',
  flex: 1,
  justifyContent: 'flex-end',
});

const JoinButton: React.FC<{
  startTime: Session['startTime'];
  onPress: () => void;
}> = ({startTime, onPress}) => {
  const {t} = useTranslation('Component.SessionCard');
  const sessionTime = useSessionStartTime(dayjs(startTime));

  return sessionTime.isReadyToJoin ? (
    <>
      <Button small variant="secondary" onPress={onPress}>
        {t('join')}
      </Button>
      <Spacer8 />
    </>
  ) : null;
};

const WalletResolver: React.FC<{
  expandedComponent: React.ReactNode;
  foldedComponent: React.ReactNode;
  startTime: Session['startTime'];
  hasCardBefore: boolean;
}> = ({expandedComponent, foldedComponent, startTime, hasCardBefore}) => {
  const sessionTime = useSessionStartTime(dayjs(startTime));

  if (!hasCardBefore && sessionTime.isReadyToJoin) {
    return <>{expandedComponent}</>;
  }
  return <>{foldedComponent}</>;
};

type SessionCardProps = {
  session: Session;
  standAlone: boolean;
  hasCardBefore: boolean;
  hasCardAfter: boolean;
};

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  standAlone,
  hasCardBefore,
  hasCardAfter,
}) => {
  const {contentId, startTime, hostProfile} = session;
  const exercise = useExerciseById(contentId);
  const user = useUser();
  const isHost = user?.uid === session.hostId;
  const showNumberOfInterested = session.interestedCount > 0;
  const {t} = useTranslation('Component.SessionCard');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const logSessionMetricEvent = useLogSessionMetricEvents();

  const {isSessionPinned, togglePinSession} = usePinnedSessons();
  const sessionPinned = isSessionPinned(session);

  const tags = useGetSessionCardTags(exercise);

  const onPinnedPress = useCallback(() => {
    togglePinSession(session);
  }, [session, togglePinSession]);

  const onPress = useCallback(() => {
    navigate('LiveSessionStack', {
      screen: 'ChangingRoom',
      params: {
        session,
      },
    });
    logSessionMetricEvent('Join Sharing Session', session);
  }, [navigate, session, logSessionMetricEvent]);

  const onContextPress = useCallback(
    () => navigate('SessionModal', {session: session}),
    [navigate, session],
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

  const interestedContent = useMemo(() => {
    if (isHost && showNumberOfInterested) {
      return (
        <>
          <InterestedBadge count={session.interestedCount} />
          <Spacer4 />
          <Interested active showIcon={false} />
        </>
      );
    }

    if (!isHost) {
      return (
        <Interested active={sessionPinned} showIcon onPress={onPinnedPress} />
      );
    }
  }, [
    isHost,
    showNumberOfInterested,
    sessionPinned,
    onPinnedPress,
    session.interestedCount,
  ]);

  if (standAlone) {
    return (
      <Card
        title={formatExerciseName(exercise)}
        tags={tags}
        image={image}
        lottie={lottie}
        onPress={onContextPress}
        hostPictureURL={hostProfile?.photoURL}
        hostName={hostProfile?.displayName}>
        <Row>
          <JoinButton onPress={onPress} startTime={startTime} />
          <SessionTimeBadge session={session} />
          <Spacer8 />
          <InterestedWrapper>{interestedContent}</InterestedWrapper>
        </Row>
      </Card>
    );
  }

  return (
    <WalletResolver
      startTime={startTime}
      hasCardBefore={hasCardBefore}
      foldedComponent={
        <WalletCard
          title={formatExerciseName(exercise)}
          image={image}
          lottie={lottie}
          hostPictureURL={hostProfile?.photoURL}
          hostName={hostProfile?.displayName}
          onPress={onContextPress}
          hasCardBefore={hasCardBefore}
          hasCardAfter={hasCardAfter}>
          <Row>
            <SessionTimeBadge session={session} />
            <Spacer8 />
            {isHost && showNumberOfInterested && (
              <InterestedBadge count={session.interestedCount} />
            )}
          </Row>
        </WalletCard>
      }
      expandedComponent={
        <Card
          inWallet
          title={formatExerciseName(exercise)}
          tags={tags}
          image={image}
          lottie={lottie}
          onPress={onContextPress}
          hostPictureURL={hostProfile?.photoURL}
          hostName={hostProfile?.displayName}>
          <Row>
            <Button small variant="secondary" onPress={onPress}>
              {t('join')}
            </Button>
            <Spacer8 />
            <SessionTimeBadge session={session} />
            <Spacer8 />
            <InterestedWrapper>{interestedContent}</InterestedWrapper>
          </Row>
        </Card>
      }
    />
  );
};

export default SessionCard;
