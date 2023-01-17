import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';

import {Session} from '../../../../../../shared/src/types/Session';
import useExerciseById from '../../../content/hooks/useExerciseById';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../navigation/constants/routes';
import Card from '../Card';

import useSessionStartTime from '../../../../routes/Session/hooks/useSessionStartTime';
import SessionTimeBadge from '../../SessionTimeBadge/SessionTimeBadge';
import {formatExerciseName} from '../../../utils/string';
import usePinnedSessons from '../../../sessions/hooks/usePinnedSessions';
import useLogSessionMetricEvents from '../../../sessions/hooks/useLogSessionMetricEvents';
import useGetSessionCardTags from './hooks/useGetSessionCardTags';

type SessionCardProps = {
  session: Session;
};

const SessionCard: React.FC<SessionCardProps> = ({session}) => {
  const {contentId, startTime, hostProfile} = session;
  const exercise = useExerciseById(contentId);
  const {t} = useTranslation('Component.SessionCard');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const logSessionMetricEvent = useLogSessionMetricEvents();

  const {isSessionPinned, togglePinSession} = usePinnedSessons();
  const sessionPinned = isSessionPinned(session);

  const sessionTime = useSessionStartTime(dayjs(startTime));

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

  return (
    <Card
      title={formatExerciseName(exercise)}
      tags={tags}
      image={image}
      lottie={lottie}
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
