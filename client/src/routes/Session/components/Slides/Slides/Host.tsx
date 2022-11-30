import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import hexToRgba from 'hex-to-rgba';
import useSessionParticipantSpotlight from '../../../hooks/useSessionParticipantSpotlight';
import Participant from '../../Participants/Participant';
import {COLORS} from '../../../../../../../shared/src/constants/colors';
import useExerciseTheme from '../../../hooks/useExerciseTheme';

const Gradient = styled(LinearGradient)({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  height: 80,
});

type HostProps = {
  active: boolean;
};
const Host: React.FC<HostProps> = ({active}) => {
  const participantSpotlight = useSessionParticipantSpotlight();

  const theme = useExerciseTheme();
  const background = theme?.backgroundColor ?? COLORS.WHITE;

  if (!active || !participantSpotlight) {
    return null;
  }

  return (
    <>
      <Participant participant={participantSpotlight} />
      <Gradient colors={[hexToRgba(background, 1), hexToRgba(background, 0)]} />
    </>
  );
};

export default Host;
