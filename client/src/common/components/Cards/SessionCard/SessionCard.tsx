import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
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
      title={exercise?.name}
      image={{
        uri: exercise?.card?.image?.source,
      }}
      onPress={onContextPress}
      buttonText={sessionTime.isReadyToJoin ? t('join') : undefined}
      onButtonPress={onPress}
      onContextPress={onContextPress}
      Icon={reminderEnabled ? BellIcon : undefined}
      hostPictureURL={hostProfile?.photoURL}
      hostName={hostProfile?.displayName}>
      <SessionTimeBadge session={session} />
    </Card>
  );
};

export default SessionCard;
