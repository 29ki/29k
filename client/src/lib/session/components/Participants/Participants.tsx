import React from 'react';
import {useWindowDimensions} from 'react-native';
import {DailyParticipant} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';

import Participant from './Participant';
import SessionNotifications from '../Notifications/SessionNotifications';
import {SPACINGS} from '../../../constants/spacings';

const ParticipantsWrapper = styled.View({
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

const Notifications = styled(SessionNotifications)({
  position: 'absolute',
  left: SPACINGS.EIGHT,
  right: SPACINGS.EIGHT,
  top: SPACINGS.EIGHT,
  bottom: SPACINGS.EIGHT,
  overflow: 'hidden',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
});

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
    <ParticipantsWrapper>
      {participants.map((participant, i) => (
        <StyledParticipant
          key={participant.user_id}
          participant={participant}
          height={participantHeight}
          // Last and odd participant - stump
          stump={i === participants.length - 1 && !(i % 2)}
        />
      ))}

      <Notifications />
    </ParticipantsWrapper>
  );
};

export default React.memo(Participants);
