import {
  DailyMediaView,
  DailyParticipant,
} from '@daily-co/react-native-daily-js';
import React, {useCallback, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import hexToRgba from 'hex-to-rgba';

import {DailyUserData} from '../../../../../../shared/src/types/Session';
import useExerciseTheme from '../../hooks/useExerciseTheme';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';
import {Display36} from '../../../components/Typography/Display/Display';
import AudioIndicator, {AudioIndicatorProps} from './AudioIndicator';
import Name from './Name';
import Image from '../../../components/Image/Image';
import useIsSessionHost from '../../../session/hooks/useIsSessionHost';
import AudioToggler from './AudioToggler';
import {DailyContext} from '../../../daily/DailyProvider';
import VideoOffIndicator from './VideoOffIndicator';

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
  overflow: 'hidden',
});

const AudioTogglerWrapper = styled.View<{inSlide?: boolean}>(({inSlide}) => ({
  position: 'absolute',
  top: inSlide ? SPACINGS.FOURTYEIGHT : SPACINGS.SIXTEEN,
  right: SPACINGS.SIXTEEN,
}));

type ParticipantAudioProps = AudioIndicatorProps & {noPermission?: boolean};

const ParticipantAudio = styled(AudioIndicator)<ParticipantAudioProps>(
  ({noPermission}) => ({
    height: 24,
    width: 24,
    borderRadius: 45,
    backgroundColor: noPermission
      ? COLORS.RED_TRANSPARENT_50
      : COLORS.BLACK_TRANSPARENT,
    padding: 2,
    position: 'absolute',
    top: SPACINGS.SIXTEEN,
    right: SPACINGS.SIXTEEN,
  }),
);

const ParticipantVideoOff = styled(VideoOffIndicator)({
  position: 'absolute',
  top: SPACINGS.FOURTYEIGHT,
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
const ProfileImage = styled(Image)({
  height: '100%',
  width: '100%',
});

const Heading = styled(Display36)({
  fontSize: SPACINGS.FOURTY,
});

const SpotlightGradient = styled(LinearGradient)({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  height: 80,
});

type ParticipantProps = {
  participant: DailyParticipant;
  topGradient?: boolean;
  inSlide?: boolean;
};

const Participant: React.FC<ParticipantProps> = ({
  participant,
  topGradient,
  inSlide,
}) => {
  const {call} = useContext(DailyContext);
  const {t} = useTranslation('Screen.Session');
  const photoURL = (participant?.userData as DailyUserData)?.photoURL;
  const theme = useExerciseTheme();
  const background = theme?.backgroundColor ?? COLORS.WHITE;
  const isSessionHost = useIsSessionHost();

  const onAudioToggle = useCallback(
    (muted: boolean) => {
      call?.updateParticipant(participant.session_id, {setAudio: !muted});
    },
    [call, participant.session_id],
  );

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
          {photoURL ? (
            <ProfileImage source={{uri: photoURL}} />
          ) : (
            <Heading>{participant?.user_name?.[0]}</Heading>
          )}
        </ParticipantPlaceholder>
      )}
      <NameGradient>
        <ParticipantName participant={participant} suffix={t('nameSuffix')} />
      </NameGradient>
      {topGradient && (
        <SpotlightGradient
          colors={[hexToRgba(background, 1), hexToRgba(background, 0)]}
        />
      )}

      {isSessionHost && !participant.tracks.audio.blocked?.byPermissions ? (
        <AudioTogglerWrapper inSlide={inSlide}>
          <AudioToggler
            muted={!participant.audioTrack}
            onToggle={onAudioToggle}
          />
        </AudioTogglerWrapper>
      ) : (
        <ParticipantAudio
          muted={!participant.audioTrack}
          noPermission={participant.tracks.audio.blocked?.byPermissions}
        />
      )}
      {participant.tracks.video.blocked?.byPermissions && (
        <ParticipantVideoOff />
      )}
    </Wrapper>
  );
};
export default Participant;
