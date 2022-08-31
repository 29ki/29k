import {DailyParticipant} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';

import {B2} from '../../common/components/Typography/Text/Text';
import {COLORS} from '../../common/constants/colors';
import {SPACINGS} from '../../common/constants/spacings';

export const renderName = (participant: DailyParticipant, suffix: string) =>
  participant.local
    ? `${participant.user_name} (${suffix})`
    : participant.user_name;

export const ParticipantName = styled(B2)({
  position: 'absolute',
  bottom: 0,
  color: COLORS.WHITE,
  paddingVertical: SPACINGS.EIGHT,
  paddingHorizontal: SPACINGS.SIXTEEN,
});
