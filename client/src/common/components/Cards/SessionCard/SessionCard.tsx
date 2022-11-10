import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import styled from 'styled-components/native';

import {Session} from '../../../../../../shared/src/types/Session';
import useExerciseById from '../../../../lib/content/hooks/useExerciseById';
import useSessionNotificationReminder from '../../../../routes/Sessions/hooks/useSessionNotificationReminder';
import {RootStackProps} from '../../../../lib/navigation/constants/routes';
import {BellIcon, PrivateIcon, PublicIcon} from '../../Icons';
import Card from '../Card';
import {Body14} from '../../Typography/Body/Body';
import Counter from '../../../../routes/Session/components/Counter/Counter';
import {Spacer4} from '../../Spacers/Spacer';
import Badge from '../../Badge/Badge';

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

type SessionCardProps = {
  session: Session;
};

const SessionCard: React.FC<SessionCardProps> = ({session}) => {
  const {contentId, startTime, hostProfile} = session;
  const exercise = useExerciseById(contentId);
  const {t} = useTranslation('Component.SessionCard');
  const {navigate} = useNavigation<NativeStackNavigationProp<RootStackProps>>();
  const {reminderEnabled} = useSessionNotificationReminder(session);

  const startAt = dayjs(startTime);
  const startingSoon = dayjs().isAfter(startAt.subtract(10, 'minutes'));
  const startingIn60 = dayjs().isAfter(startAt.subtract(60, 'minutes'));

  const onPress = () =>
    navigate('SessionStack', {
      screen: 'ChangingRoom',
      params: {
        sessionId: session.id,
      },
    });

  const onContextPress = () => navigate('SessionModal', {session: session});

  return (
    <Card
      title={exercise?.name}
      image={{
        uri: exercise?.card?.image?.source,
      }}
      onPress={onContextPress}
      buttonText={startingSoon ? t('join') : ''}
      onButtonPress={onPress}
      onContextPress={onContextPress}
      Icon={reminderEnabled ? BellIcon : undefined}
      hostPictureURL={hostProfile.photoURL}
      hostName={hostProfile.displayName}>
      <Row>
        {startingSoon ? (
          ''
        ) : startingIn60 ? (
          <Body14>{t('counterLabel.startsIn')}</Body14>
        ) : (
          <Body14>{t('counterLabel.starts')}</Body14>
        )}
        <Spacer4 />
        <Badge
          text={<Counter startTime={startAt} />}
          Icon={session.type === 'private' ? <PrivateIcon /> : <PublicIcon />}
        />
      </Row>
    </Card>
  );
};

export default SessionCard;
