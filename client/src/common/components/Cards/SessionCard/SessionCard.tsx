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
import {PlusIcon, BellIcon} from '../../Icons';
import Card from '../Card';
import useAddToCalendar from '../../../../routes/Sessions/hooks/useAddToCalendar';
import {Body14, BodyBold} from '../../Typography/Body/Body';
import Counter from '../../../../routes/Session/components/Counter/Counter';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';
import {Spacer4} from '../../Spacers/Spacer';

const Badge = styled.View({
  backgroundColor: COLORS.PURE_WHITE,
  paddingVertical: SPACINGS.FOUR,
  paddingHorizontal: SPACINGS.EIGHT,
  borderRadius: SPACINGS.EIGHT,
});

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

type SessionCardProps = {
  session: Session;
};

const SessionCard: React.FC<SessionCardProps> = ({session}) => {
  const {contentId, startTime, started, hostProfile} = session;
  const exercise = useExerciseById(contentId);
  const addToCalendar = useAddToCalendar();
  const {t} = useTranslation('Component.SessionCard');
  const {navigate} = useNavigation<NativeStackNavigationProp<RootStackProps>>();
  const {reminderEnabled} = useSessionNotificationReminder(session);

  const startAt = dayjs(startTime);
  const startingNow = dayjs().isAfter(startAt.subtract(10, 'minutes'));

  const onPress = () =>
    startingNow
      ? navigate('SessionStack', {
          screen: 'ChangingRoom',
          params: {
            sessionId: session.id,
          },
        })
      : addToCalendar(exercise?.name, startAt, startAt.add(30, 'minutes'));

  const onContextPress = () => navigate('SessionModal', {session: session});

  return (
    <Card
      title={exercise?.name}
      buttonText={startingNow ? t('join') : t('addToCalendar')}
      ButtonIcon={!startingNow ? PlusIcon : undefined}
      image={{
        uri: exercise?.card?.image?.source,
      }}
      onPress={onContextPress}
      onButtonPress={onPress}
      onContextPress={onContextPress}
      Icon={reminderEnabled ? BellIcon : undefined}
      hostPictureURL={hostProfile.photoURL}
      hostName={hostProfile.displayName}>
      <Row>
        <Body14>{t('starts')}</Body14>
        <Spacer4 />
        <Badge>
          <Body14>
            <BodyBold>
              <Counter startTime={startAt} starting={started} />
            </BodyBold>
          </Body14>
        </Badge>
      </Row>
    </Card>
  );
};

export default SessionCard;
