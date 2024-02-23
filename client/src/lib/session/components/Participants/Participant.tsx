import {
  DailyMediaView,
  DailyParticipant,
} from '@daily-co/react-native-daily-js';
import React, {useCallback, useContext} from 'react';
import {Alert, ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import hexToRgba from 'hex-to-rgba';

import {DailyUserData} from '../../../../../../shared/src/schemas/Session';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';
import {Display36} from '../../../components/Typography/Display/Display';
import AudioIndicator from './AudioIndicator';
import Name from './Name';
import Image from '../../../components/Image/Image';
import useIsSessionHost from '../../../session/hooks/useIsSessionHost';
import AudioToggler from './AudioToggler';
import {DailyContext} from '../../../daily/DailyProvider';
import VideoDeniedIndicator from './VideoDeniedIndicator';
import useSessionState from '../../state/state';
import TouchableOpacity from '../../../components/TouchableOpacity/TouchableOpacity';
import AudioDeniedIndicator from './AudioDeniedIndicator';

const Wrapper = styled(TouchableOpacity)({
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

const ParticipantAudio = styled(AudioIndicator)({
  position: 'absolute',
  top: SPACINGS.SIXTEEN,
  right: SPACINGS.SIXTEEN,
});

const ParticipantAudioDenied = styled(AudioDeniedIndicator)({
  position: 'absolute',
  top: SPACINGS.SIXTEEN,
  right: SPACINGS.SIXTEEN,
});

const ParticipantVideoDenied = styled(VideoDeniedIndicator)({
  position: 'absolute',
  top: SPACINGS.FOURTYEIGHT,
  right: SPACINGS.SIXTEEN,
});

const NameGradient = styled(LinearGradient).attrs({
  colors: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)'],
  // Fixes issue with types not being passed down properly from .attrs
})<Optional<LinearGradientProps, 'colors'>>({
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
  style?: ViewStyle;
};

const Participant: React.FC<ParticipantProps> = ({
  participant,
  topGradient,
  inSlide,
  style,
}) => {
  const {call} = useContext(DailyContext);
  const {t} = useTranslation('Component.Participant');
  const userData = participant?.userData as DailyUserData;
  const photoURL = userData?.photoURL;
  const userName = userData?.userName;
  const theme = useSessionState(state => state.exercise?.theme);
  const background = theme?.backgroundColor ?? COLORS.WHITE;
  const isSessionHost = useIsSessionHost();

  const onAudioToggle = useCallback(
    (muted: boolean) => {
      call?.updateParticipant(participant.session_id, {setAudio: !muted});
    },
    [call, participant.session_id],
  );

  const removeParticipant = useCallback(async () => {
    call?.updateParticipant(participant.session_id, {eject: true});
  }, [call, participant.session_id]);

  const confirmRemoveUser = useCallback(() => {
    if (isSessionHost) {
      Alert.alert(
        t('removeTitle', {displayName: userName}),
        t('removeText', {displayName: userName}),
        [
          {
            text: t('removeNo'),
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: t('removeYes'),
            onPress: removeParticipant,
            style: 'destructive',
          },
        ],
      );
    }
  }, [isSessionHost, removeParticipant, t, userName]);

  return (
    <Wrapper style={style} onLongPress={confirmRemoveUser}>
      {participant.tracks.video.state === 'off' ? (
        <ParticipantPlaceholder>
          {photoURL ? (
            <ProfileImage source={{uri: photoURL}} />
          ) : (
            <Heading>{userName?.[0]}</Heading>
          )}
        </ParticipantPlaceholder>
      ) : (
        <DailyMediaViewWrapper
          videoTrack={participant.tracks.video.persistentTrack ?? null}
          audioTrack={participant.tracks.audio.persistentTrack ?? null}
          objectFit="cover"
          mirror={participant.local}
        />
      )}
      <NameGradient>
        <ParticipantName
          participant={participant}
          suffix={t('nameSuffix', {ns: 'Screen.Session'})}
        />
      </NameGradient>
      {topGradient && (
        <SpotlightGradient
          colors={[hexToRgba(background, 1), hexToRgba(background, 0)]}
        />
      )}

      {isSessionHost && !participant.tracks.audio.blocked?.byPermissions ? (
        <AudioTogglerWrapper inSlide={inSlide}>
          <AudioToggler
            muted={Boolean(participant.tracks.audio.off?.byUser)}
            onToggle={onAudioToggle}
          />
        </AudioTogglerWrapper>
      ) : participant.tracks.audio.blocked?.byPermissions ? (
        <ParticipantAudioDenied />
      ) : (
        <ParticipantAudio
          muted={Boolean(participant.tracks.audio.off?.byUser)}
        />
      )}
      {participant.tracks.video.blocked?.byPermissions && (
        <ParticipantVideoDenied />
      )}
    </Wrapper>
  );
};

export default React.memo(Participant);
