import React from 'react';
import {useWindowDimensions} from 'react-native';
import {DailyParticipant} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';

import Participant from './Participant';

const Container = styled.View({
  flexShrink: 0,
  flexDirection: 'row',
  flexWrap: 'wrap',
});

const StyledParticipant = styled(Participant)<{stump: boolean; height: number}>(
  ({stump, height}) => ({
    flex: 'auto',
    width: stump ? '100%' : '50%',
    height,
  }),
);

type ParticipantsProps = {
  containerHeight: number;
  participants: Array<DailyParticipant>;
};

const Participants: React.FC<ParticipantsProps> = ({
  containerHeight,
  participants,
}) => {
  const dimensions = useWindowDimensions();

  const participantHeight =
    /* Content is square so the height equals the screen width
    If more than two participants remove 50px to show more participants */
    containerHeight - dimensions.width - (participants.length > 2 ? 50 : 0);

  return (
    <Container>
      {participants.map((participant, i) => (
        <StyledParticipant
          key={participant.user_id}
          participant={participant}
          height={participantHeight}
          // Last and odd participant - stump
          stump={i === participants.length - 1 && !(i % 2)}
        />
      ))}
    </Container>
  );
};

export default React.memo(Participants);
