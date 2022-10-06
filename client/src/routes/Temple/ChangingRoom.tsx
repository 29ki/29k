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
  ArrowLeftIcon,
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
import {DailyContext} from '../Temple/DailyProvider';
import {localParticipantSelector, templeAtom} from './state/state';
import {TempleStackProps} from '../../common/constants/routes';
import {SPACINGS} from '../../common/constants/spacings';
import NS from '../../lib/i18n/constants/namespaces';
import TextInput from '../../common/components/Typography/TextInput/TextInput';
import AudioIndicator from './components/Participants/AudioIdicator';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';
import useSubscribeToTemple from './hooks/useSubscribeToTemple';
import useUpdateTempleExerciseState from './hooks/useUpdateTempleExerciseState';
import useIsTempleFacilitator from './hooks/useIsTempleFacilitator';
import {DailyUserData} from '../../../../shared/src/types/Temple';

type TempleNavigationProps = NativeStackNavigationProp<TempleStackProps>;

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
  const {t} = useTranslation(NS.SCREEN.CHANGING_ROOM);
  const [localUserName, setLocalUserName] = useState('');
  const [joiningTemple, setJoiningTemple] = useState(false);

  const {goBack, navigate} = useNavigation<TempleNavigationProps>();
  const {
    toggleAudio,
    toggleVideo,
    setUserName,
    preJoinMeeting,
    joinMeeting,
    hasAppPermissions,
  } = useContext(DailyContext);

  const temple = useRecoilValue(templeAtom);
  const {
    params: {templeId},
  } = useRoute<RouteProp<TempleStackProps, 'ChangingRoom'>>();

  useSubscribeToTemple(templeId);
  const {setSpotlightParticipant} = useUpdateTempleExerciseState(templeId);
  const isFacilitator = useIsTempleFacilitator();
  const isFocused = useIsFocused();
  const me = useRecoilValue(localParticipantSelector);

  useEffect(() => {
    const startVideo = async () => {
      if (isFocused && temple?.url) {
        preJoinMeeting(temple?.url);

        if (isFacilitator && me?.user_id) {
          setSpotlightParticipant(me.user_id);
        }
      }
    };
    startVideo();
  }, [
    preJoinMeeting,
    setSpotlightParticipant,
    temple?.url,
    isFacilitator,
    me?.user_id,
    isFocused,
  ]);

  if (!isFocused) {
    return null;
  }

  const join = async () => {
    setJoiningTemple(true);
    await joinMeeting({inPortal: true} as DailyUserData);
    navigate('Portal', {templeId});
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
    <>
      <TopSafeArea />
      <Gutters>
        <IconButton variant="tertiary" onPress={goBack} Icon={ArrowLeftIcon} />
      </Gutters>
      <Wrapper>
        <VideoWrapper>
          {hasVideo ? (
            <DailyMediaViewWrapper
              videoTrack={me?.videoTrack ?? null}
              audioTrack={me?.audioTrack ?? null}
              objectFit={'cover'}
              mirror={me?.local}
            />
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
            />
            <Spacer28 />
            <Button
              variant="secondary"
              onPress={handleJoin}
              loading={joiningTemple}
              disabled={!localUserName.length || joiningTemple}>
              {t('join_button')}
            </Button>
          </InputWrapper>
          <Spacer28 />
        </Gutters>
      </Wrapper>
      <BottomSafeArea minSize={SPACINGS.TWENTYEIGHT} />
    </>
  );
};

export default ChangingRoom;
