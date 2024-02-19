import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {KeyboardAvoidingViewProps, Platform} from 'react-native';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {DailyMediaView} from '@daily-co/react-native-daily-js';

import Button from '../../../../../lib/components/Buttons/Button';
import Gutters from '../../../../../lib/components/Gutters/Gutters';
import {
  FilmCameraIcon,
  FilmCameraOffIcon,
  MicrophoneIcon,
  MicrophoneOffIcon,
} from '../../../../../lib/components/Icons';
import {
  BottomSafeArea,
  Spacer16,
  Spacer28,
  Spacer32,
  Spacer48,
  TopSafeArea,
} from '../../../../../lib/components/Spacers/Spacer';
import {Body16} from '../../../../../lib/components/Typography/Body/Body';
import {COLORS} from '../../../../../../../shared/src/constants/colors';
import {DailyContext} from '../../../../../lib/daily/DailyProvider';
import useSessionState from '../../../../../lib/session/state/state';
import {
  ModalStackProps,
  LiveSessionStackProps,
  TabNavigatorProps,
} from '../../../../../lib/navigation/constants/routes';
import {SPACINGS} from '../../../../../lib/constants/spacings';
import TextInput from '../../../../../lib/components/Typography/TextInput/TextInput';
import AudioIndicator from '../../../../../lib/session/components/Participants/AudioIndicator';
import IconButton from '../../../../../lib/components/Buttons/IconButton/IconButton';
import Screen from '../../../../../lib/components/Screen/Screen';
import useLocalParticipant from '../../../../../lib/daily/hooks/useLocalParticipant';
import useUser from '../../../../../lib/user/hooks/useUser';
import Image from '../../../../../lib/components/Image/Image';
import useSubscribeToSessionIfFocused from '../../../../../lib/session/hooks/useSubscribeToSessionIfFocused';
import {joinSession} from '../../../../../lib/sessions/api/session';
import useLiveSessionMetricEvents from '../../../../../lib/session/hooks/useLiveSessionMetricEvents';
import useCheckPermissions from '../../../../../lib/session/hooks/useCheckPermissions';
import SessionMood from './SessionMood';
import AutoScrollView from '../../../../../lib/components/AutoScrollView/AutoScrollView';
import useLogSessionMood from '../hooks/useLogSessionMood';

const KeyboardWrapper = styled.KeyboardAvoidingView.attrs({
  behavior: Platform.select<KeyboardAvoidingViewProps['behavior']>({
    ios: 'position',
    android: undefined,
  }),
})({});

const Controls = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const VideoWrapper = styled.View({
  width: 200,
  height: 232,
  borderRadius: 24,
  overflow: 'hidden',
  alignContent: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  backgroundColor: COLORS.BLACK,
});

const DailyMediaViewWrapper = styled(DailyMediaView)({
  flex: 1,
});

const VideoText = styled(Body16)({
  textAlign: 'center',
  color: COLORS.PURE_WHITE,
});

const InputWrapper = styled.View({
  flexDirection: 'row',
});

const StyledTextInput = styled(TextInput)({
  flexGrow: 1,
});

const Audio = styled(AudioIndicator)({
  position: 'absolute',
  right: SPACINGS.SIXTEEN,
  top: SPACINGS.SIXTEEN,
});

const ImageContainer = styled.View({
  width: '100%',
  height: '100%',
});

const HairCheck = () => {
  const {t} = useTranslation('Screen.ChangingRoom');
  const [joiningMeeting, setJoiningMeeting] = useState(false);

  const {goBack, navigate} =
    useNavigation<
      NativeStackNavigationProp<
        LiveSessionStackProps & TabNavigatorProps & ModalStackProps
      >
    >();
  const {
    startCamera,
    toggleAudio,
    toggleVideo,
    setUserData,
    setUserName,
    joinMeeting,
  } = useContext(DailyContext);

  const sessionState = useSessionState(state => state.sessionState);
  const {
    params: {session, isReJoining},
  } = useRoute<RouteProp<LiveSessionStackProps, 'ChangingRoom'>>();

  useSubscribeToSessionIfFocused(session);
  const isFocused = useIsFocused();
  const me = useLocalParticipant();
  const user = useUser();
  const [localUserName, setLocalUserName] = useState(user?.displayName ?? '');
  const logSessionMetricEvent = useLiveSessionMetricEvents();
  const {
    checkAndPromptJoinPermissions,
    checkAndPromptCameraPermissions,
    checkAndPromptMicrophonePermissions,
  } = useCheckPermissions();
  const logSessionMood = useLogSessionMood();

  const hasAudio = Boolean(me?.tracks.audio.state !== 'off');
  const hasVideo = Boolean(me?.tracks.video.state !== 'off');

  useEffect(() => {
    logSessionMetricEvent('Enter Changing Room');
    startCamera();
  }, [logSessionMetricEvent, startCamera]);

  useEffect(() => {
    if (isReJoining && isFocused) {
      // If this is a rejoin, reset loading state
      setJoiningMeeting(false);
    }
  }, [isReJoining, isFocused]);

  const join = useCallback(async () => {
    logSessionMood();
    setJoiningMeeting(true);
    if (sessionState?.started) {
      await joinMeeting();
      navigate('Session', {session});
    } else {
      await joinMeeting({
        subscribeToTracksAutomatically: false,
      });
      setUserData({inPortal: true});
      navigate('IntroPortal', {session});
    }
  }, [
    setJoiningMeeting,
    sessionState?.started,
    joinMeeting,
    navigate,
    setUserData,
    session,
    logSessionMood,
  ]);

  const joinPress = useCallback(async () => {
    joinSession(session.inviteCode);
    if (localUserName) {
      setUserName(localUserName);
      checkAndPromptJoinPermissions(join);
    }
  }, [
    localUserName,
    setUserName,
    checkAndPromptJoinPermissions,
    join,
    session.inviteCode,
  ]);

  const toggleAudioPress = useCallback(() => {
    checkAndPromptMicrophonePermissions(() => {
      toggleAudio(!hasAudio);
    });
  }, [checkAndPromptMicrophonePermissions, toggleAudio, hasAudio]);

  const toggleVideoPress = useCallback(() => {
    checkAndPromptCameraPermissions(() => {
      toggleVideo(!hasVideo);
    });
  }, [checkAndPromptCameraPermissions, toggleVideo, hasVideo]);

  return (
    <Screen onPressBack={goBack}>
      <KeyboardWrapper>
        <AutoScrollView>
          <TopSafeArea />
          <Spacer48 />
          <Gutters big>
            <SessionMood />
          </Gutters>
          <Spacer32 />
          <VideoWrapper>
            {isFocused && hasVideo ? (
              <DailyMediaViewWrapper
                videoTrack={me?.tracks.video.persistentTrack ?? null}
                audioTrack={me?.tracks.audio.persistentTrack ?? null}
                objectFit={'cover'}
                mirror={me?.local}
              />
            ) : user?.photoURL ? (
              <ImageContainer>
                <Image source={{uri: user.photoURL}} />
              </ImageContainer>
            ) : (
              <VideoText>{t('cameraOff')}</VideoText>
            )}
            <Audio muted={!hasAudio} />
          </VideoWrapper>
          <Spacer28 />
          <Gutters>
            <Controls>
              <IconButton
                disabled
                onPress={toggleAudioPress}
                active={hasAudio}
                variant="secondary"
                Icon={hasAudio ? MicrophoneIcon : MicrophoneOffIcon}
              />
              <Spacer16 />
              <IconButton
                onPress={toggleVideoPress}
                active={hasVideo}
                variant="secondary"
                Icon={hasVideo ? FilmCameraIcon : FilmCameraOffIcon}
              />
            </Controls>
            <Spacer48 />
            <InputWrapper>
              <StyledTextInput
                onChangeText={setLocalUserName}
                onSubmitEditing={joinPress}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={20}
                defaultValue={localUserName}
                placeholder={t('placeholder')}
              />
              <Spacer28 />
              <Button
                variant="secondary"
                onPress={joinPress}
                loading={joiningMeeting}
                disabled={!localUserName.length || joiningMeeting}>
                {t('join_button')}
              </Button>
            </InputWrapper>
          </Gutters>
          <BottomSafeArea minSize={SPACINGS.TWENTYEIGHT} />
        </AutoScrollView>
      </KeyboardWrapper>
    </Screen>
  );
};

export default HairCheck;
