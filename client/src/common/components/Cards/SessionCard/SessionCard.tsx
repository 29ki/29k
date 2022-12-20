import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';

import {Session} from '../../../../../../shared/src/types/Session';
import useExerciseById from '../../../../lib/content/hooks/useExerciseById';
import useSessionNotificationReminder from '../../../../routes/Sessions/hooks/useSessionNotificationReminder';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../../lib/navigation/constants/routes';
import {BellIcon} from '../../Icons';
import Card from '../Card';

import useSessionStartTime from '../../../../routes/Session/hooks/useSessionStartTime';
import * as metrics from '../../../../lib/metrics';
import SessionTimeBadge from '../../SessionTimeBadge/SessionTimeBadge';
import {formatExerciseName} from '../../../utils/string';
import usePinnedSessons from '../../../../lib/user/hooks/usePinnedSessions';
import styled from 'styled-components/native';
import Interested from '../../Interested/Interested';

const ChildWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

type SessionCardProps = {
  session: Session;
};

const SessionCard: React.FC<SessionCardProps> = ({session}) => {
  const {contentId, startTime, hostProfile} = session;
  const exercise = useExerciseById(contentId);
  const {t} = useTranslation('Component.SessionCard');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const {reminderEnabled} = useSessionNotificationReminder(session);
  const sessionTime = useSessionStartTime(dayjs(startTime));
  const {isSessionPinned} = usePinnedSessons();

  const sessionPinned = useMemo(
    () => isSessionPinned(session),
    [isSessionPinned, session],
  );

  const onPress = () => {
    navigate('SessionStack', {
      screen: 'ChangingRoom',
      params: {
        sessionId: session.id,
      },
    });
    metrics.logEvent('Join Session', {
      'Session Exercise ID': session.contentId,
      'Session Language': session.language,
      'Session Type': session.type,
      'Session Start Time': session.startTime,
    });
  };

  const onContextPress = () => navigate('SessionModal', {session: session});

  return (
    <Card
      title={formatExerciseName(exercise)}
      duration={exercise?.duration}
      image={{
        uri: exercise?.card?.image?.source,
      }}
      onPress={onContextPress}
      buttonText={sessionTime.isReadyToJoin ? t('join') : undefined}
      onButtonPress={onPress}
      Icon={reminderEnabled ? BellIcon : undefined}
      hostPictureURL={hostProfile?.photoURL}
      hostName={hostProfile?.displayName}>
      <ChildWrapper>
        <SessionTimeBadge session={session} />
        <Interested active={sessionPinned} />
      </ChildWrapper>
    </Card>
  );
};

export default SessionCard;
