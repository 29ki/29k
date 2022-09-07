import React from 'react';
import {DailyMediaView} from '@daily-co/react-native-daily-js';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../common/constants/colors';
import {SPACINGS} from '../../../../../common/constants/spacings';
import {participantByIdSelector, templeAtom} from '../../../state/state';
import AudioIndicator from '../../AudioIdicator';
import ParticipantName from '../../../ParticipantName';

const Wrapper = styled.View({
  flex: 1,
  backgroundColor: 'red',
});

const DailyMediaViewWrapper = styled(DailyMediaView)({
  height: '100%',
  width: '100%',
});

const ParticipantAudio = styled(AudioIndicator)({
  height: 24,
  width: 24,
  borderRadius: 45,
  backgroundColor: COLORS.BLACK_TRANSPARENT,
  padding: 2,
  position: 'absolute',
  top: SPACINGS.FIFTYSIX,
  left: SPACINGS.SIXTEEN,
});

const Facilitator = () => {
  const temple = useRecoilValue(templeAtom);
  console.log('dailyFacilitatorId', temple?.dailyFacilitatorId);
  const facilitator = useRecoilValue(
    participantByIdSelector(temple?.dailyFacilitatorId),
  );

  console.log(facilitator);

  if (!facilitator) {
    return null;
  }
  return (
    <Wrapper>
      <DailyMediaViewWrapper
        videoTrack={facilitator?.videoTrack ?? null}
        audioTrack={facilitator?.audioTrack ?? null}
        objectFit={'cover'}
        zOrder={facilitator?.local ? 1 : 0}
        mirror={facilitator?.local}
      />
      <ParticipantName participant={facilitator} />
      <ParticipantAudio muted={!facilitator?.audioTrack} />
    </Wrapper>
  );
};

export default Facilitator;
