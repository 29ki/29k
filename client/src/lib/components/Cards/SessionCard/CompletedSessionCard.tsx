import React, {useCallback} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';

import {ModalStackProps} from '../../../navigation/constants/routes';

import useExerciseById from '../../../content/hooks/useExerciseById';

import {formatContentName} from '../../../utils/string';

import Badge from '../../Badge/Badge';
import {Body14} from '../../Typography/Body/Body';
import {CommunityIcon, MeIcon} from '../../Icons';
import {Spacer4} from '../../Spacers/Spacer';
import {SessionMode} from '../../../../../../shared/src/schemas/Session';
import {CompletedSessionEvent} from '../../../../../../shared/src/types/Event';
import useUserProfile from '../../../user/hooks/useUserProfile';
import Node from '../../Node/Node';
import {SPACINGS} from '../../../constants/spacings';
import CardSmall from '../CardSmall';

type CompletedSessionCardProps = {
  completedSessionEvent: CompletedSessionEvent;
};

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const CompletedSessionCard: React.FC<CompletedSessionCardProps> = ({
  completedSessionEvent,
}) => {
  const {t} = useTranslation('Component.CompletedSessionCard');
  const {
    payload: {mode, exerciseId, language},
    timestamp,
  } = completedSessionEvent;
  const exercise = useExerciseById(exerciseId, language);
  const hostProfile = useUserProfile(completedSessionEvent.payload.hostId);
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<ModalStackProps, 'CompletedSessionModal'>
    >();

  const onContextPress = useCallback(
    () =>
      navigate('CompletedSessionModal', {
        completedSessionEvent,
      }),
    [navigate, completedSessionEvent],
  );

  return (
    <CardSmall
      title={formatContentName(exercise)}
      graphic={exercise?.card}
      hostProfile={hostProfile}
      onPress={onContextPress}
      completed>
      <Row>
        <Node size={SPACINGS.SIXTEEN} />
        <Spacer4 />
        <Body14>{t('completed')}</Body14>
        <Spacer4 />
        <Badge
          text={dayjs(timestamp).format('ddd, D MMM')}
          IconAfter={
            mode === SessionMode.async ? <MeIcon /> : <CommunityIcon />
          }
        />
      </Row>
    </CardSmall>
  );
};

export default CompletedSessionCard;
