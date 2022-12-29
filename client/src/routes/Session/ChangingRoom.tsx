import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ActivityIndicator, Platform} from 'react-native';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {DailyMediaView} from '@daily-co/react-native-daily-js';

import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {
  FilmCameraIcon,
  FilmCameraOffIcon,
  MicrophoneIcon,
  MicrophoneOffIcon,
} from '../../common/components/Icons';
import {
  BottomSafeArea,
  Spacer16,
  Spacer28,
  Spacer48,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {Body16} from '../../common/components/Typography/Body/Body';
import {COLORS} from '../../../../shared/src/constants/colors';
import {DailyContext} from '../../lib/daily/DailyProvider';
import useSessionState from './state/state';
import {
  ModalStackProps,
  SessionStackProps,
  TabNavigatorProps,
} from '../../lib/navigation/constants/routes';
import {SPACINGS} from '../../common/constants/spacings';
import TextInput from '../../common/components/Typography/TextInput/TextInput';
import AudioIndicator from './components/Participants/AudioIdicator';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';
import useUpdateSessionExerciseState from './hooks/useUpdateSessionExerciseState';
import useIsSessionHost from './hooks/useIsSessionHost';
import Screen from '../../common/components/Screen/Screen';
import useLocalParticipant from '../../lib/daily/hooks/useLocalParticipant';
import useUser from '../../lib/user/hooks/useUser';
import Image from '../../common/components/Image/Image';
import useSubscribeToSessionIfFocused from './hooks/useSusbscribeToSessionIfFocused';
import useLogInSessionMetricEvents from './hooks/useLogInSessionMetricEvents';
import useCheckPermissions from './hooks/useCheckPermissions';

const Wrapper = styled.KeyboardAvoidingView.attrs({
  behavior: Platform.select({ios: 'padding', android: undefined}),
})({
  flex: 1,
  justifyContent: 'center',
});

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

const ChangingRoom = () => {
  const {t} = useTranslation('Screen.ChangingRoom');
  const [joiningMeeting, setJoiningMeeting] = useState(false);

  const {goBack, navigate} =
    useNavigation<
      NativeStackNavigationProp<
        SessionStackProps & TabNavigatorProps & ModalStackProps
      >
    >();
  const {toggleAudio, toggleVideo, setUserName, joinMeeting, preJoinMeeting} =
    useContext(DailyContext);

  const session = useSessionState(state => state.session);
  const {
    params: {sessionId: sessionId},
  } = useRoute<RouteProp<SessionStackProps, 'ChangingRoom'>>();

  useSubscribeToSessionIfFocused(sessionId);
  const {setSpotlightParticipant} = useUpdateSessionExerciseState(sessionId);
  const isHost = useIsSessionHost();
  const isFocused = useIsFocused();
  const me = useLocalParticipant();
  const user = useUser();
  const [localUserName, setLocalUserName] = useState(user?.displayName ?? '');
  const {logSessionMetricEvent} = useLogInSessionMetricEvents();
  const {
    checkJoinPermissions,
    checkCameraPermissions,
    checkMicrophonePermissions,
  } = useCheckPermissions();

  const hasAudio = Boolean(me?.audioTrack);
  const hasVideo = Boolean(me?.videoTrack);

  useEffect(() => {
    if (session?.id) {
      logSessionMetricEvent('Enter Changing Room');
    }
  }, [logSessionMetricEvent, session?.id]);

  useEffect(() => {
    if (isFocused && session?.url) {
      preJoinMeeting(session?.url);
    }
  }, [isFocused, session?.url, preJoinMeeting]);

  useEffect(() => {
    if (isHost && me?.user_id) {
      setSpotlightParticipant(me.user_id);
    }
  }, [isHost, me?.user_id, setSpotlightParticipant]);

  const join = useCallback(async () => {
    setJoiningMeeting(true);
    if (session?.started) {
      await joinMeeting();
      navigate('Session', {sessionId});
    } else {
      await joinMeeting({
        subscribeToTracksAutomatically: false,
        userData: {
          inPortal: true,
        },
      });
      navigate('IntroPortal', {sessionId});
    }
  }, [setJoiningMeeting, sessionId, session?.started, joinMeeting, navigate]);

  const joinPress = useCallback(() => {
    setUserName(localUserName);
    checkJoinPermissions(join);
  }, [localUserName, setUserName, checkJoinPermissions, join]);

  const toggleAudioPress = useCallback(() => {
    checkMicrophonePermissions(() => {
      toggleAudio(!hasAudio);
    });
  }, [checkMicrophonePermissions, toggleAudio, hasAudio]);

  const toggleVideoPress = useCallback(() => {
    checkCameraPermissions(() => {
      toggleVideo(!hasVideo);
    });
  }, [checkCameraPermissions, toggleVideo, hasVideo]);

  return (
    <Screen onPressBack={goBack}>
      <TopSafeArea />
      <Wrapper>
        {!me ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <VideoWrapper>
              {isFocused && hasVideo ? (
                <DailyMediaViewWrapper
                  videoTrack={me?.videoTrack ?? null}
                  audioTrack={me?.audioTrack ?? null}
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
                  autoFocus
                  onChangeText={setLocalUserName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={20}
                  value={localUserName}
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
          </>
        )}
      </Wrapper>
      <BottomSafeArea minSize={SPACINGS.TWENTYEIGHT} />
    </Screen>
  );
};

export default ChangingRoom;
