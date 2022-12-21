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
import * as metrics from '../../../../lib/metrics';
import SessionTimeBadge from '../../SessionTimeBadge/SessionTimeBadge';
import {formatExerciseName} from '../../../utils/string';
import useUser from '../../../../lib/user/hooks/useUser';
import usePinnedSessons from '../../../../lib/user/hooks/usePinnedSessions';

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
  const user = useUser();

  const isHost = session.hostId === user?.uid;

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
    metrics.logEvent('Join Sharing Session', {
      'Sharing Session ID': session.id,
      'Sharing Session Type': session.type,
      'Sharing Session Start Time': session.startTime,
      'Exercise ID': session.contentId,
      Host: isHost,
      Language: session.language,
    });
  }, [navigate, isHost, session]);

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
