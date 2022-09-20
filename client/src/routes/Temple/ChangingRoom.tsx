import React, {useContext, useEffect, useState} from 'react';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Platform} from 'react-native';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {DailyMediaView} from '@daily-co/react-native-daily-js';
import {useRecoilValue} from 'recoil';

import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {BackIcon} from '../../common/components/Icons';
import {
  BottomSafeArea,
  Spacer16,
  Spacer28,
  Spacer48,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import AudioToggleButton from './components/Buttons/AudioToggleButton';
import VideoToggleButton from './components/Buttons/VideoToggleButton';
import {B2} from '../../common/components/Typography/Text/Text';
import {COLORS} from '../../common/constants/colors';
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
  backgroundColor: COLORS.GREY,
});

const DailyMediaViewWrapper = styled(DailyMediaView)({
  flex: 1,
});

const VideoText = styled(B2)({
  textAlign: 'center',
  color: COLORS.WHITE,
});

const InputWrapper = styled.View({
  flexDirection: 'row',
});

const Audio = styled(AudioIndicator)({
  position: 'absolute',
  right: SPACINGS.SIXTEEN,
  top: SPACINGS.SIXTEEN,
});

const ChangingRoom = () => {
  const {t} = useTranslation(NS.SCREEN.CHANGING_ROOM);
  const [localUserName, setLocalUserName] = useState('');

  const {goBack, navigate} = useNavigation<TempleNavigationProps>();
  const {toggleAudio, toggleVideo, setUserName, preJoinMeeting} =
    useContext(DailyContext);

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

  const handleJoin = () => {
    setUserName(localUserName);
    navigate('Portal', {templeId});
  };

  const hasAudio = Boolean(me?.audioTrack);
  const hasVideo = Boolean(me?.videoTrack);

  return (
    <>
      <TopSafeArea />
      <Gutters>
        <IconButton onPress={goBack} Icon={BackIcon} />
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
            <AudioToggleButton
              onPress={() => toggleAudio(!hasAudio)}
              active={hasAudio}
            />
            <Spacer16 />
            <VideoToggleButton
              onPress={() => toggleVideo(!hasVideo)}
              active={hasVideo}
            />
          </Controls>
          <Spacer48 />
          <InputWrapper>
            <TextInput
              autoFocus
              onChangeText={setLocalUserName}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={20}
            />
            <Spacer28 />
            <Button onPress={handleJoin} disabled={!localUserName.length}>
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
