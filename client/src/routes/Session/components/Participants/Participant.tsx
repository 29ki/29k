import {
  DailyMediaView,
  DailyParticipant,
} from '@daily-co/react-native-daily-js';
import React from 'react';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {Display36} from '../../../../common/components/Typography/Display/Display';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../../common/constants/spacings';
import * as NS from '../../../../../../shared/src/constants/namespaces';
import AudioIndicator from './AudioIdicator';
import Name from './Name';

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: COLORS.BLACK,
});

const ParticipantPlaceholder = styled.View({
  backgroundColor: COLORS.CREAM,
  borderRadius: SPACINGS.SIXTEEN,
  width: 80,
  height: 80,
  justifyContent: 'center',
  alignItems: 'center',
});

const ParticipantAudio = styled(AudioIndicator)({
  height: 24,
  width: 24,
  borderRadius: 45,
  backgroundColor: COLORS.BLACK_TRANSPARENT,
  padding: 2,
  position: 'absolute',
  top: SPACINGS.SIXTEEN,
  right: SPACINGS.SIXTEEN,
});
const NameGradient = styled(LinearGradient).attrs({
  colors: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)'],
})({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: SPACINGS.SIXTY,
  paddingTop: SPACINGS.EIGHT,
});

const ParticipantName = styled(Name)({
  position: 'absolute',
  left: SPACINGS.SIXTEEN,
  bottom: SPACINGS.EIGHT,
});

const DailyMediaViewWrapper = styled(DailyMediaView)({
  height: '100%',
  width: '100%',
});

const Heading = styled(Display36)({
  fontSize: SPACINGS.FOURTY,
});

type ParticipantProps = {
  participant: DailyParticipant;
};

const Participant: React.FC<ParticipantProps> = ({participant}) => {
  const {t} = useTranslation(NS.SCREEN.SESSION);
  return (
    <Wrapper>
      {participant.videoTrack ? (
        <DailyMediaViewWrapper
          videoTrack={participant.videoTrack ?? null}
          audioTrack={participant.audioTrack ?? null}
          objectFit="cover"
          mirror={participant.local}
        />
      ) : (
        <ParticipantPlaceholder>
          <Heading>{participant?.user_name?.[0]}</Heading>
        </ParticipantPlaceholder>
      )}
      <NameGradient>
        <ParticipantName participant={participant} suffix={t('nameSuffix')} />
      </NameGradient>
      <ParticipantAudio muted={!participant.audioTrack} />
    </Wrapper>
  );
};
export default Participant;
