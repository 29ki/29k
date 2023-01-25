import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import dayjs from 'dayjs';

import {Session} from '../../../../../../shared/src/types/Session';

import {formatExerciseName} from '../../../utils/string';

import useExerciseById from '../../../content/hooks/useExerciseById';
import useSessionStartTime from '../../../../routes/Session/hooks/useSessionStartTime';
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
import {Spacer8} from '../../Spacers/Spacer';

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-end',
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
    navigate('SessionStack', {
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
        hostPictureURL={hostProfile?.photoURL}
        hostName={hostProfile?.displayName}
        pinned={sessionPinned}
        onPinnedPress={onPinnedPress}>
        <Row>
          <JoinButton onPress={onPress} startTime={startTime} />
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
        <WalletCard
          title={formatExerciseName(exercise)}
          image={image}
          lottie={lottie}
          hostPictureURL={hostProfile?.photoURL}
          hostName={hostProfile?.displayName}
          onPress={onContextPress}
          hasCardBefore={hasCardBefore}
          hasCardAfter={hasCardAfter}>
          <SessionTimeBadge session={session} />
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
          hostName={hostProfile?.displayName}
          pinned={sessionPinned}
          onPinnedPress={onPinnedPress}>
          <Row>
            <Button small variant="secondary" onPress={onPress}>
              {t('join')}
            </Button>
            <Spacer8 />
            <SessionTimeBadge session={session} />
          </Row>
        </Card>
      }
    />
  );
};

export default SessionCard;
