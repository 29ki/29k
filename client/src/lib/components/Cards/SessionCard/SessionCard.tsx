import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';

import {LiveSessionType} from '../../../../../../shared/src/schemas/Session';

import {formatContentName} from '../../../utils/string';

import useExerciseById from '../../../content/hooks/useExerciseById';
import useSessionStartTime from '../../../session/hooks/useSessionStartTime';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../navigation/constants/routes';

import Card from '../Card';
import SessionTimeBadge from '../../SessionTimeBadge/SessionTimeBadge';
import useLogSessionMetricEvents from '../../../sessions/hooks/useLogSessionMetricEvents';
import useGetSessionCardTags from './hooks/useGetSessionCardTags';
import Button from '../../Buttons/Button';
import {Spacer8} from '../../Spacers/Spacer';
import useUser from '../../../user/hooks/useUser';
import Interested from '../../Interested/Interested';
import usePinSession from '../../../sessions/hooks/usePinSession';
import useSessionReminder from '../../../sessions/hooks/useSessionReminder';
import {ViewStyle} from 'react-native';
import {BodyBold} from '../../Typography/Body/Body';
import CardSmall from '../CardSmall';
import useGetActiveCollectionByExerciseId from '../../../content/hooks/useGetActiveCollectionByExerciseId';

const JoinButton: React.FC<{
  startTime: LiveSessionType['startTime'];
  onPress: () => void;
}> = ({startTime, onPress}) => {
  const {t} = useTranslation('Component.SessionCard');
  const sessionTime = useSessionStartTime(dayjs(startTime));

  return sessionTime.isReadyToJoin ? (
    <>
      <Button size="xsmall" variant="secondary" onPress={onPress}>
        <BodyBold>{t('join')}</BodyBold>
      </Button>
      <Spacer8 />
    </>
  ) : null;
};

type SessionCardProps = {
  session: LiveSessionType;
  small?: boolean;
  disableJoinButton?: boolean;
  onBeforeContextPress?: () => void;
  style?: ViewStyle;
};

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  small,
  disableJoinButton,
  onBeforeContextPress,
  style,
}) => {
  const {exerciseId, startTime, hostProfile, language} = session;
  const exercise = useExerciseById(exerciseId, language);
  const user = useUser();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const logSessionMetricEvent = useLogSessionMetricEvents();
  const {isPinned} = usePinSession(session);
  const {reminderEnabled} = useSessionReminder(session);
  const getActiveCollectionByExerciseId = useGetActiveCollectionByExerciseId();

  const isHost = user?.uid === session.hostId;
  const interestedCount = isHost ? session.interestedCount : undefined;
  const tags = useGetSessionCardTags(exercise);

  const collection = getActiveCollectionByExerciseId(exerciseId);

  const onPress = useCallback(() => {
    logSessionMetricEvent('Join Sharing Session', session); // Log before navigating for correct Origin property in event
    navigate('LiveSessionStack', {
      screen: 'ChangingRoom',
      params: {
        session,
      },
    });
  }, [navigate, session, logSessionMetricEvent]);

  const onContextPress = useCallback(() => {
    if (onBeforeContextPress) {
      onBeforeContextPress();
    }
    navigate('SessionModal', {
      session,
    });
  }, [navigate, session, onBeforeContextPress]);

  if (!exercise) return null;

  if (small) {
    return (
      <CardSmall
        title={formatContentName(exercise)}
        graphic={exercise?.card}
        hostProfile={hostProfile}
        onPress={onContextPress}
        style={style}>
        <SessionTimeBadge session={session} />
        <Spacer8 />
        <Interested
          compact
          reminder={reminderEnabled}
          count={interestedCount}
        />
      </CardSmall>
    );
  }

  return (
    <Card
      title={formatContentName(exercise)}
      tags={tags}
      graphic={exercise?.card}
      hostProfile={hostProfile}
      onPress={onContextPress}
      isPinned={isPinned}
      reminderEnabled={reminderEnabled}
      interestedCount={interestedCount}
      collection={collection}
      style={style}>
      {!disableJoinButton && (
        <JoinButton onPress={onPress} startTime={startTime} />
      )}
      <SessionTimeBadge session={session} />
    </Card>
  );
};

export default SessionCard;
