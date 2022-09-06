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
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import AudioToggleButton from './components/Buttons/AudioToggleButton';
import VideoToggleButton from './components/Buttons/VideoToggleButton';
import {B2} from '../../common/components/Typography/Text/Text';
import {COLORS} from '../../common/constants/colors';
import {DailyContext} from '../Temple/DailyProvider';
import {localParticipantAtom, templeAtom} from './state/state';
import {TempleStackProps} from '../../common/constants/routes';
import useTemple from './hooks/useTemple';
import {SPACINGS} from '../../common/constants/spacings';
import NS from '../../lib/i18n/constants/namespaces';
import TextInput from '../../common/components/Typography/TextInput/TextInput';

type TempleNavigationProps = NativeStackNavigationProp<
  TempleStackProps,
  'Temple'
>;

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

const DailyMediaViewWrapper = styled(DailyMediaView)({
  flex: 1,
  backgroundColor: COLORS.GREY,
});

const InputLabel = styled(B2)({
  textAlign: 'center',
});

const ChangingRoom = () => {
  const {t} = useTranslation(NS.SCREEN.CHANGING_ROOM);
  const [localUserName, setLocalUserName] = useState('');
  const {goBack, navigate} = useNavigation<TempleNavigationProps>();
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
  } = useRoute<RouteProp<TempleStackProps, 'ChangingRoom'>>();

  const {subscribeTemple} = useTemple();
  const isFocused = useIsFocused();

  useEffect(() => subscribeTemple(templeId), [subscribeTemple, templeId]);

  useEffect(() => {
    const startVideo = async () => {
      if (isFocused && temple?.url) {
        preJoinMeeting();
      }
    };
    startVideo();
  }, [preJoinMeeting, temple, isFocused]);

  const me = useRecoilValue(localParticipantAtom);

  if (!isFocused) {
    return null;
  }

  const handleJoin = () => {
    setUserName(localUserName);
    navigate('Temple', {templeId});
  };

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
        audioTrack={null}
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
        <InputLabel>{t('body')}</InputLabel>
        <Spacer28 />
        <TextInput onChangeText={setLocalUserName} />
        <Spacer28 />
        <Button onPress={handleJoin} disabled={!localUserName.length}>
          {t('join_button')}
        </Button>
      </Gutters>
      <BottomSafeArea minSize={SPACINGS.TWENTYEIGHT} />
    </Wrapper>
  );
};

export default ChangingRoom;
