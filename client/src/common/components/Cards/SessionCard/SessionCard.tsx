import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';

import {Session} from '../../../../../../shared/src/types/Session';
import useExerciseById from '../../../../lib/content/hooks/useExerciseById';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../../lib/navigation/constants/routes';
import Card from '../Card';

import useSessionStartTime from '../../../../routes/Session/hooks/useSessionStartTime';
import SessionTimeBadge from '../../SessionTimeBadge/SessionTimeBadge';
import {formatExerciseName} from '../../../utils/string';
import usePinnedSessons from '../../../../lib/user/hooks/usePinnedSessions';
import useLogSessionMetricEvents from '../../../../routes/Session/hooks/useLogSessionMetricEvents';

type SessionCardProps = {
  session: Session;
};

const SessionCard: React.FC<SessionCardProps> = ({session}) => {
  const {contentId, startTime, hostProfile} = session;
  const exercise = useExerciseById(contentId);
  const {t} = useTranslation('Component.SessionCard');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const sessionTime = useSessionStartTime(dayjs(startTime));
  const {isSessionPinned, togglePinSession} = usePinnedSessons();
  const logSessionMetricEvent = useLogSessionMetricEvents();

  const sessionPinned = useMemo(
    () => isSessionPinned(session),
    [isSessionPinned, session],
  );

  const onPinnedPress = useCallback(() => {
    togglePinSession(session);
  }, [session, togglePinSession]);

  const onPress = useCallback(() => {
    navigate('SessionStack', {
      screen: 'ChangingRoom',
      params: {
        sessionId: session.id,
      },
    });
    logSessionMetricEvent('Join Sharing Session', session);
  }, [navigate, session, logSessionMetricEvent]);

  const onContextPress = useCallback(
    () => navigate('SessionModal', {session: session}),
    [navigate, session],
  );

  const source = useMemo(
    () => ({
      uri: exercise?.card?.image?.source,
    }),
    [exercise],
  );

  return (
    <Card
      title={formatExerciseName(exercise)}
      duration={exercise?.duration}
      image={source}
      onPress={onContextPress}
      buttonText={sessionTime.isReadyToJoin ? t('join') : undefined}
      onButtonPress={onPress}
      hostPictureURL={hostProfile?.photoURL}
      hostName={hostProfile?.displayName}
      pinned={sessionPinned}
      onPinnedPress={onPinnedPress}>
      <SessionTimeBadge session={session} />
    </Card>
  );
};

export default SessionCard;
