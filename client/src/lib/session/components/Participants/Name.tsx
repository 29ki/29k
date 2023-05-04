import React from 'react';
import {DailyParticipant} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';

import {Body16} from '../../../components/Typography/Body/Body';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {ViewStyle} from 'react-native';
import {DailyUserData} from '../../../../../../shared/src/schemas/Session';

const renderName = (participant: DailyParticipant, suffix: string) =>
  participant.local
    ? `${(participant.userData as DailyUserData)?.userName} (${suffix})`
    : (participant.userData as DailyUserData)?.userName;

const Name = styled(Body16)({
  color: COLORS.PURE_WHITE,
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

export default React.memo(ParticipantName);
