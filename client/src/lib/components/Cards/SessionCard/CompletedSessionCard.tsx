import React, {useCallback, useMemo} from 'react';

import {CompletedSession} from '../../../user/state/state';
import {UserProfile} from '../../../../../../shared/src/types/User';

import useExerciseById from '../../../content/hooks/useExerciseById';

import {formatExerciseName} from '../../../utils/string';

import WalletCard from '../WalletCard';
import Badge from '../../Badge/Badge';
import {Body14} from '../../Typography/Body/Body';
import styled from 'styled-components/native';
import {CheckIcon, CommunityIcon, ProfileFillIcon} from '../../Icons';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {Spacer4} from '../../Spacers/Spacer';
import dayjs from 'dayjs';
import {SessionType} from '../../../../../../shared/src/types/Session';

type CompletedSessionCardProps = {
  session: CompletedSession;
  hostProfile: UserProfile | null;
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
  session,
  hostProfile,
  hasCardBefore,
  hasCardAfter,
}) => {
  const {contentId, completedAt, type} = session;
  const exercise = useExerciseById(contentId);

  const onContextPress = useCallback(() => {}, []);

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
    <WalletCard
      title={formatExerciseName(exercise)}
      image={image}
      lottie={lottie}
      hostPictureURL={hostProfile?.photoURL || exercise?.card.host?.photoURL}
      hostName={hostProfile?.displayName || exercise?.card.host?.displayName}
      onPress={onContextPress}
      hasCardBefore={hasCardBefore}
      hasCardAfter={hasCardAfter}
      completed={true}>
      <Row>
        <ChekIconWrapper>
          <CheckIcon fill={COLORS.PRIMARY} />
        </ChekIconWrapper>
        <Body14>{'Completed'}</Body14>
        <Spacer4 />
        <Badge
          text={dayjs(completedAt).format('ddd, D MMM')}
          Icon={
            type === SessionType.async ? <ProfileFillIcon /> : <CommunityIcon />
          }
        />
      </Row>
    </WalletCard>
  );
};

export default CompletedSessionCard;
