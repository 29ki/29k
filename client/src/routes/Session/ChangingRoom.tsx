import React, {useContext, useEffect, useState} from 'react';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ActivityIndicator, Alert, Linking, Platform} from 'react-native';
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
import * as metrics from '../../lib/metrics';

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
  const {
    toggleAudio,
    toggleVideo,
    setUserName,
    joinMeeting,
    preJoinMeeting,
    hasAppPermissions,
  } = useContext(DailyContext);

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

  useEffect(() => {
    if (session?.id) {
      metrics.logEvent('Enter Changing Room', {
        'Sharing Session ID': session.id,
        'Sharing Session Type': session.type,
        'Sharing Session Start Time': session.startTime,
        'Exercise ID': session.contentId,
        Host: isHost,
        Language: session.language,
      });
    }
  }, [
    session?.id,
    session?.type,
    session?.startTime,
    session?.contentId,
    session?.language,
    isHost,
  ]);

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

  const join = async () => {
    setJoiningMeeting(true);
    if (session?.started) {
      await joinMeeting();
      navigate('Session', {sessionId: sessionId});
    } else {
      await joinMeeting({
        subscribeToTracksAutomatically: false,
        userData: {
          inPortal: true,
        },
      });
      navigate('IntroPortal', {sessionId: sessionId});
    }
  };

  const permissionsAlert = () =>
    Alert.alert(t('permissionsAlert.title'), t('permissionsAlert.message'), [
      {
        text: t('permissionsAlert.join'),
        onPress: join,
      },
      {
        style: 'cancel',
        text: t('permissionsAlert.openSettings'),
        onPress: () => Linking.openSettings(),
      },
    ]);

  const handleJoin = () => {
    setUserName(localUserName);
    if (hasAppPermissions()) {
      join();
    } else {
      permissionsAlert();
    }
  };

  const hasAudio = Boolean(me?.audioTrack);
  const hasVideo = Boolean(me?.videoTrack);

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
                  onPress={() => toggleAudio(!hasAudio)}
                  active={hasAudio}
                  variant="secondary"
                  Icon={hasAudio ? MicrophoneIcon : MicrophoneOffIcon}
                />
                <Spacer16 />
                <IconButton
                  onPress={() => toggleVideo(!hasVideo)}
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
                  onPress={handleJoin}
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
