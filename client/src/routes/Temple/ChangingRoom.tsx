import React, {useContext, useEffect} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import styled from 'styled-components/native';

import Button from '../../common/components/Buttons/Button';

import Gutters from '../../common/components/Gutters/Gutters';
import {BackIcon} from '../../common/components/Icons';
import {
  BottomSafeArea,
  Spacer16,
  Spacer28,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import AudioToggleButton from '../Temple/Buttons/AudioToggleButton';
import VideoToggleButton from '../Temple/Buttons/VideoToggleButton';
import {B1} from '../../common/components/Typography/Text/Text';
import {COLORS} from '../../common/constants/colors';
import {DailyContext} from '../Temple/DailyProvider';
import {DailyMediaView} from '@daily-co/react-native-daily-js';
import {useRecoilValue} from 'recoil';
import {localParticipantAtom, templeAtom} from './state/state';
import {ROUTES, ScreenProps} from '../../common/constants/routes';
import useTemple from './hooks/useTemple';
import {SPACINGS} from '../../common/constants/spacings';

type ScreenNavigationProps = NativeStackNavigationProp<ScreenProps>;

const Wrapper = styled.KeyboardAvoidingView.attrs({
  behavior: Platform.select({ios: 'padding', android: undefined}),
})({flex: 1});

const Back = styled.TouchableOpacity({
  width: 40,
  height: 40,
});

const Controls = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const Input = styled.TextInput({
  borderBottomWidth: 1,
  borderBottomColor: COLORS.GREY,
  paddingBottom: 2,
  paddingHorizontal: 2,
  textAlign: 'center',
});

const DailyMediaViewWrapper = styled(DailyMediaView)({
  flex: 1,
  backgroundColor: COLORS.GREY,
});

const ChangingRoom = () => {
  const {goBack, navigate} = useNavigation<ScreenNavigationProps>();
  const {
    toggleAudio,
    toggleVideo,
    hasAudio,
    hasVideo,
    setUserName,
    preJoinMeeting,
  } = useContext(DailyContext);

  const temple = useRecoilValue(templeAtom);
  const {
    params: {templeId},
  } = useRoute<RouteProp<ScreenProps, 'ChangingRoom'>>();

  const {subscribeTemple} = useTemple();

  useEffect(() => subscribeTemple(templeId), [subscribeTemple, templeId]);

  useEffect(() => {
    const startVideo = async () => {
      if (temple?.url) {
        preJoinMeeting();
      }
    };
    startVideo();
  }, [preJoinMeeting, temple]);

  const me = useRecoilValue(localParticipantAtom);

  return (
    <Wrapper>
      <TopSafeArea />
      <Gutters>
        <Back onPress={goBack}>
          <BackIcon />
        </Back>
      </Gutters>
      <DailyMediaViewWrapper
        videoTrack={me?.videoTrack ?? null}
        audioTrack={me?.audioTrack ?? null}
        objectFit={'cover'}
        mirror={me?.local}
      />

      <Spacer28 />
      <Gutters>
        <Controls>
          <AudioToggleButton onPress={toggleAudio} active={hasAudio} />
          <Spacer16 />
          <VideoToggleButton onPress={toggleVideo} active={hasVideo} />
        </Controls>
        <Spacer28 />
        <B1>Please type what do you like to be called</B1>
        <Spacer28 />
        <Input
          onChangeText={userName => {
            setUserName(userName);
          }}
        />
        <Spacer28 />
        <Button onPress={() => navigate(ROUTES.TEMPLE, {templeId})}>
          Join
        </Button>
      </Gutters>
      <BottomSafeArea minSize={SPACINGS.TWENTYEIGHT} />
    </Wrapper>
  );
};

export default ChangingRoom;
