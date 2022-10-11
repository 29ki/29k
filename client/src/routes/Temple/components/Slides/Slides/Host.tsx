import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import hexToRgba from 'hex-to-rgba';
import {COLORS} from '../../../../../../../shared/src/constants/colors';
import useTempleExercise from '../../../hooks/useTempleExercise';
import useTempleParticipantSpotlight from '../../../hooks/useTempleParticipantSpotlight';
import Participant from '../../Participants/Participant';

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
  const participantSpotlight = useTempleParticipantSpotlight();
  const exercise = useTempleExercise();

  if (!active || !participantSpotlight) {
    return null;
  }

  const backgroundColor = exercise?.theme?.backgroundColor ?? COLORS.WHITE;

  return (
    <>
      <Participant participant={participantSpotlight} />
      <Gradient
        colors={[hexToRgba(backgroundColor, 1), hexToRgba(backgroundColor, 0)]}
      />
    </>
  );
};

export default Host;
