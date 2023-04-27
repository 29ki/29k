import React, {useCallback, useMemo} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';

import {ModalStackProps} from '../../../navigation/constants/routes';

import useExerciseById from '../../../content/hooks/useExerciseById';

import {formatContentName} from '../../../utils/string';

import SessionWalletCard from '../WalletCards/SessionWalletCard';
import Badge from '../../Badge/Badge';
import {Body14} from '../../Typography/Body/Body';
import {CheckIcon, CommunityIcon, MeIcon} from '../../Icons';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {Spacer4} from '../../Spacers/Spacer';
import {SessionMode} from '../../../../../../shared/src/schemas/Session';
import {CompletedSessionEvent} from '../../../../../../shared/src/types/Event';
import useUserProfile from '../../../user/hooks/useUserProfile';

type CompletedSessionCardProps = {
  completedSessionEvent: CompletedSessionEvent;
  hasCardBefore: boolean;
  hasCardAfter: boolean;
};

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const ChekIconWrapper = styled.View({
  width: 22,
  height: 22,
  alignSelf: 'center',
});

const CompletedSessionCard: React.FC<CompletedSessionCardProps> = ({
  completedSessionEvent,
  hasCardBefore,
  hasCardAfter,
}) => {
  const {t} = useTranslation('Component.CompletedSessionCard');
  const {
    payload: {mode, exerciseId},
    timestamp,
  } = completedSessionEvent;
  const exercise = useExerciseById(exerciseId);
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
    <SessionWalletCard
      title={formatContentName(exercise)}
      image={image}
      lottie={lottie}
      hostPictureURL={hostProfile?.photoURL || exercise?.card?.host?.photoURL}
      hostName={hostProfile?.displayName || exercise?.card?.host?.displayName}
      onPress={onContextPress}
      hasCardBefore={hasCardBefore}
      hasCardAfter={hasCardAfter}
      completed={true}>
      <Row>
        <ChekIconWrapper>
          <CheckIcon fill={COLORS.PRIMARY} />
        </ChekIconWrapper>
        <Body14>{t('completed')}</Body14>
        <Spacer4 />
        <Badge
          text={dayjs(timestamp).format('ddd, D MMM')}
          IconAfter={
            mode === SessionMode.async ? <MeIcon /> : <CommunityIcon />
          }
        />
      </Row>
    </SessionWalletCard>
  );
};

export default CompletedSessionCard;
