import React from 'react';
import {DailyParticipant} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';

import {B2} from '../../../../common/components/Typography/Text/Text';
import {COLORS} from '../../../../common/constants/colors';
import {SPACINGS} from '../../../../common/constants/spacings';
import {ViewStyle} from 'react-native';

const renderName = (participant: DailyParticipant, suffix: string) =>
  participant.local
    ? `${participant.user_name} (${suffix})`
    : participant.user_name;

const Name = styled(B2)({
  color: COLORS.WHITE,
});

type ParticipantNameProps = {
  participant: DailyParticipant;
  suffix?: string;
  style?: ViewStyle;
};

const ParticipantName: React.FC<ParticipantNameProps> = ({
  participant,
  suffix = '',
  style,
}) => <Name style={style}>{renderName(participant, suffix)}</Name>;

export default ParticipantName;
