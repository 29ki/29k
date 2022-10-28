import React, {useContext, useEffect, useState} from 'react';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Alert, Linking, Platform} from 'react-native';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {DailyMediaView} from '@daily-co/react-native-daily-js';
import {useRecoilValue} from 'recoil';

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
} from '../../common/components/Spacers/Spacer';
import {Body16} from '../../common/components/Typography/Body/Body';
import {COLORS} from '../../../../shared/src/constants/colors';
import {DailyContext} from './DailyProvider';
import {localParticipantSelector, sessionAtom} from './state/state';
import {SessionStackProps} from '../../lib/navigation/constants/routes';
import {SPACINGS} from '../../common/constants/spacings';
import TextInput from '../../common/components/Typography/TextInput/TextInput';
import AudioIndicator from './components/Participants/AudioIdicator';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';
import useSubscribeToSession from './hooks/useSubscribeToSession';
import useUpdateSessionExerciseState from './hooks/useUpdateSessionExerciseState';
import useIsSessionFacilitator from './hooks/useIsSessionHost';
import Screen from '../../common/components/Screen/Screen';

type SessionNavigationProps = NativeStackNavigationProp<SessionStackProps>;

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

const ChangingRoom = () => {
  const {t} = useTranslation('Screen.ChangingRoom');
  const [localUserName, setLocalUserName] = useState('');

  const {goBack, navigate} = useNavigation<SessionNavigationProps>();
  const {
    toggleAudio,
    toggleVideo,
    setUserName,
    preJoinMeeting,
    hasAppPermissions,
  } = useContext(DailyContext);

  const session = useRecoilValue(sessionAtom);
  const {
    params: {sessionId: sessionId},
  } = useRoute<RouteProp<SessionStackProps, 'ChangingRoom'>>();

  useSubscribeToSession(sessionId);
  const {setSpotlightParticipant} = useUpdateSessionExerciseState(sessionId);
  const isFacilitator = useIsSessionFacilitator();
  const isFocused = useIsFocused();
  const me = useRecoilValue(localParticipantSelector);

  useEffect(() => {
    const startVideo = async () => {
      if (isFocused && session?.url) {
        preJoinMeeting(session?.url);

        if (isFacilitator && me?.user_id) {
          setSpotlightParticipant(me.user_id);
        }
      }
    };
    startVideo();
  }, [
    preJoinMeeting,
    setSpotlightParticipant,
    session?.url,
    isFacilitator,
    me?.user_id,
    isFocused,
  ]);

  const join = async () => {
    navigate('IntroPortal', {sessionId: sessionId});
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
      <Wrapper>
        <VideoWrapper>
          {isFocused &&
            (hasVideo ? (
              <DailyMediaViewWrapper
                videoTrack={me?.videoTrack ?? null}
                audioTrack={me?.audioTrack ?? null}
                objectFit={'cover'}
                mirror={me?.local}
              />
            ) : (
              <VideoText>{t('cameraOff')}</VideoText>
            ))}
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
              placeholder={t('placeholder')}
            />
            <Spacer28 />
            <Button
              variant="secondary"
              onPress={handleJoin}
              disabled={!localUserName.length}>
              {t('join_button')}
            </Button>
          </InputWrapper>
          <Spacer28 />
        </Gutters>
      </Wrapper>
      <BottomSafeArea minSize={SPACINGS.TWENTYEIGHT} />
    </Screen>
  );
};

export default ChangingRoom;
