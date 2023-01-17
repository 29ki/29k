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

type SessionCardProps = {
  session: Session;
};

const SessionCard: React.FC<SessionCardProps> = ({session}) => {
  const {contentId, startTime, hostProfile} = session;
  const exercise = useExerciseById(contentId);
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

  const source = useMemo(
    () => ({
      uri: exercise?.card?.image?.source,
    }),
    [exercise],
  );

  return (
    <Card
      title={formatExerciseName(exercise)}
      tags={tags}
      image={source}
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
};

export default SessionCard;
