import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import dayjs from 'dayjs';

import {LiveSession} from '../../../../../../shared/src/types/Session';

import {formatExerciseName} from '../../../utils/string';

import useExerciseById from '../../../content/hooks/useExerciseById';
import useSessionStartTime from '../../../session/hooks/useSessionStartTime';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../navigation/constants/routes';

import Card from '../Card';
import SessionWalletCard from '../WalletCards/SessionWalletCard';
import SessionTimeBadge from '../../SessionTimeBadge/SessionTimeBadge';
import useLogSessionMetricEvents from '../../../sessions/hooks/useLogSessionMetricEvents';
import useGetSessionCardTags from './hooks/useGetSessionCardTags';
import Button from '../../Buttons/Button';
import {Spacer8} from '../../Spacers/Spacer';
import useUser from '../../../user/hooks/useUser';
import Interested from '../../Interested/Interested';
import usePinSession from '../../../sessions/hooks/usePinSession';
import useSessionReminderNotification from '../../../sessions/hooks/useSessionReminderNotification';

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-end',
});

const FullInterested = styled(Interested)({
  flex: 1,
  justifyContent: 'flex-end',
});

const JoinButton: React.FC<{
  startTime: LiveSession['startTime'];
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
  startTime: LiveSession['startTime'];
  hasCardBefore: boolean;
}> = ({expandedComponent, foldedComponent, startTime, hasCardBefore}) => {
  const sessionTime = useSessionStartTime(dayjs(startTime));

  if (!hasCardBefore && sessionTime.isReadyToJoin) {
    return <>{expandedComponent}</>;
  }
  return <>{foldedComponent}</>;
};

type SessionCardProps = {
  session: LiveSession;
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
  const {exerciseId, startTime, hostProfile} = session;
  const exercise = useExerciseById(exerciseId);
  const user = useUser();
  const {t} = useTranslation('Component.SessionCard');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const logSessionMetricEvent = useLogSessionMetricEvents();
  const {isPinned} = usePinSession(session);
  const {reminderEnabled} = useSessionReminderNotification(session);

  const isHost = user?.uid === session.hostId;
  const interestedCount = isHost ? session.interestedCount : undefined;
  const tags = useGetSessionCardTags(exercise);

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

  if (standAlone) {
    return (
      <Card
        title={formatExerciseName(exercise)}
        tags={tags}
        image={image}
        lottie={lottie}
        onPress={onContextPress}
        hostPictureURL={hostProfile?.photoURL || exercise?.card.host?.photoURL}
        hostName={hostProfile?.displayName || exercise?.card.host?.displayName}>
        <Row>
          <JoinButton onPress={onPress} startTime={startTime} />
          <SessionTimeBadge session={session} />
          <Spacer8 />
          <FullInterested
            active={isPinned}
            reminder={reminderEnabled}
            count={interestedCount}
          />
        </Row>
      </Card>
    );
  }

  return (
    <WalletResolver
      startTime={startTime}
      hasCardBefore={hasCardBefore}
      foldedComponent={
        <SessionWalletCard
          title={formatExerciseName(exercise)}
          image={image}
          lottie={lottie}
          hostPictureURL={
            hostProfile?.photoURL || exercise?.card.host?.photoURL
          }
          hostName={
            hostProfile?.displayName || exercise?.card.host?.displayName
          }
          onPress={onContextPress}
          hasCardBefore={hasCardBefore}
          hasCardAfter={hasCardAfter}>
          <Row>
            <SessionTimeBadge session={session} />
            <Spacer8 />
            <Interested
              compact
              reminder={reminderEnabled}
              count={interestedCount}
            />
          </Row>
        </SessionWalletCard>
      }
      expandedComponent={
        <Card
          inWallet
          title={formatExerciseName(exercise)}
          tags={tags}
          image={image}
          lottie={lottie}
          onPress={onContextPress}
          hostPictureURL={
            hostProfile?.photoURL || exercise?.card.host?.photoURL
          }
          hostName={
            hostProfile?.displayName || exercise?.card.host?.displayName
          }>
          <Row>
            <Button small variant="secondary" onPress={onPress}>
              {t('join')}
            </Button>
            <Spacer8 />
            <SessionTimeBadge session={session} />
            <Spacer8 />
            <FullInterested
              active={isPinned}
              reminder={reminderEnabled}
              count={interestedCount}
            />
          </Row>
        </Card>
      }
    />
  );
};

export default SessionCard;
