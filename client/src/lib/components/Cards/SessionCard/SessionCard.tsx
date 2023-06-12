import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import dayjs from 'dayjs';

import {
  LiveSessionType,
  SessionMode,
} from '../../../../../../shared/src/schemas/Session';

import {formatContentName} from '../../../utils/string';

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
import useSessionReminder from '../../../sessions/hooks/useSessionReminder';
import {ViewStyle} from 'react-native';

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-end',
});

const JoinButton: React.FC<{
  startTime: LiveSessionType['startTime'];
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
  startTime: LiveSessionType['startTime'];
  hasCardBefore: boolean;
}> = ({expandedComponent, foldedComponent, startTime, hasCardBefore}) => {
  const sessionTime = useSessionStartTime(dayjs(startTime));

  if (!hasCardBefore && sessionTime.isReadyToJoin) {
    return <>{expandedComponent}</>;
  }
  return <>{foldedComponent}</>;
};

type SessionCardProps = {
  session: LiveSessionType;
  standAlone?: boolean;
  hasCardBefore?: boolean;
  hasCardAfter?: boolean;
  disableHostPress?: boolean;
  disableJoinButton?: boolean;
  onBeforeContextPress?: () => void;
  style?: ViewStyle;
};

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  standAlone = true,
  hasCardBefore = false,
  hasCardAfter = false,
  disableHostPress,
  disableJoinButton,
  onBeforeContextPress,
  style,
}) => {
  const {exerciseId, startTime, hostProfile} = session;
  const exercise = useExerciseById(exerciseId);
  const user = useUser();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const logSessionMetricEvent = useLogSessionMetricEvents();
  const {isPinned} = usePinSession(session);
  const {reminderEnabled} = useSessionReminder(session);

  const isHost = user?.uid === session.hostId;
  const interestedCount = isHost ? session.interestedCount : undefined;
  const tags = useGetSessionCardTags(exercise);

  const onPress = useCallback(() => {
    logSessionMetricEvent('Join Sharing Session', session); // Log before navigating for correct Origin property in event
    navigate('LiveSessionStack', {
      screen: 'ChangingRoom',
      params: {
        session,
      },
    });
  }, [navigate, session, logSessionMetricEvent]);

  const onContextPress = useCallback(() => {
    if (onBeforeContextPress) {
      onBeforeContextPress();
    }
    navigate('SessionModal', {session: session});
  }, [navigate, session, onBeforeContextPress]);

  const onHostPress = useCallback(() => {
    navigate('HostInfoModal', {host: hostProfile});
  }, [navigate, hostProfile]);

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
        title={formatContentName(exercise)}
        tags={tags}
        image={image}
        lottie={lottie}
        onPress={onContextPress}
        onHostPress={!disableHostPress ? onHostPress : undefined}
        hostPictureURL={
          session.mode === SessionMode.live
            ? hostProfile?.photoURL
            : exercise?.card?.host?.photoURL
        }
        hostName={
          session.mode === SessionMode.live
            ? hostProfile?.displayName
            : exercise?.card?.host?.displayName
        }
        isHost={isHost}
        isPinned={isPinned}
        reminderEnabled={reminderEnabled}
        interestedCount={session.interestedCount}
        style={style}>
        <Row>
          {!disableJoinButton && (
            <JoinButton onPress={onPress} startTime={startTime} />
          )}
          <SessionTimeBadge session={session} />
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
          title={formatContentName(exercise)}
          image={image}
          lottie={lottie}
          hostPictureURL={
            session.mode === SessionMode.live
              ? hostProfile?.photoURL
              : exercise?.card?.host?.photoURL
          }
          hostName={
            session.mode === SessionMode.live
              ? hostProfile?.displayName
              : exercise?.card?.host?.displayName
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
              count={isHost ? session.interestedCount : undefined}
            />
          </Row>
        </SessionWalletCard>
      }
      expandedComponent={
        <Card
          inWallet
          title={formatContentName(exercise)}
          tags={tags}
          image={image}
          lottie={lottie}
          onPress={onContextPress}
          hostPictureURL={
            session.mode === SessionMode.live
              ? hostProfile?.photoURL
              : exercise?.card?.host?.photoURL
          }
          hostName={
            session.mode === SessionMode.live
              ? hostProfile?.displayName
              : exercise?.card?.host?.displayName
          }
          isPinned={isPinned}
          reminderEnabled={reminderEnabled}
          interestedCount={interestedCount}>
          <Row>
            {!disableJoinButton && (
              <JoinButton onPress={onPress} startTime={startTime} />
            )}
            <SessionTimeBadge session={session} />
          </Row>
        </Card>
      }
    />
  );
};

export default SessionCard;
