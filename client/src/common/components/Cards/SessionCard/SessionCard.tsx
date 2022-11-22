import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import styled from 'styled-components/native';

import {SessionWithHostProfile} from '../../../../../../shared/src/types/Session';
import useExerciseById from '../../../../lib/content/hooks/useExerciseById';
import useSessionNotificationReminder from '../../../../routes/Sessions/hooks/useSessionNotificationReminder';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../../lib/navigation/constants/routes';
import {BellIcon, PrivateIcon, PublicIcon} from '../../Icons';
import Card from '../Card';
import {Body14} from '../../Typography/Body/Body';
import {Spacer4} from '../../Spacers/Spacer';
import Badge from '../../Badge/Badge';
import useSessionStartTime from '../../../../routes/Session/hooks/useSessionStartTime';
import * as metrics from '../../../../lib/metrics';

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

type SessionCardProps = {
  session: SessionWithHostProfile;
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
      hostPictureURL={hostProfile.photoURL}
      hostName={hostProfile.displayName}>
      <Row>
        {!sessionTime.isReadyToJoin && (
          <>
            {sessionTime.isInLessThanAnHour ? (
              <Body14>{t('counterLabel.startsIn')}</Body14>
            ) : (
              <Body14>{t('counterLabel.starts')}</Body14>
            )}
            <Spacer4 />
          </>
        )}
        <Badge
          text={sessionTime.isStarted ? t('counter.started') : sessionTime.time}
          Icon={session.type === 'private' ? <PrivateIcon /> : <PublicIcon />}
        />
      </Row>
    </Card>
  );
};

export default SessionCard;
