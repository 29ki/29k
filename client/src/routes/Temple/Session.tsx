import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  DailyMediaView,
  DailyParticipant,
} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';

import {
  selectedParticipantIdAtom,
  videoSharingFields,
  participantsSelector,
  selectedParticipantSelector,
  templeAtom,
} from './state/state';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {Spacer12, Spacer16} from '../../common/components/Spacers/Spacer';
import AudioToggleButton from './Buttons/AudioToggleButton';
import VideoToggleButton from './Buttons/VideoToggleButton';
import {COLORS} from '../../common/constants/colors';
import LeaveButton from './Buttons/LeaveButton';
import {B1} from '../../common/components/Typography/Text/Text';
import {ScreenProps} from '../../common/constants/routes';
import useTemple from './hooks/useTemple';
import {DailyContext} from './DailyProvider';
import {Temple} from '../../../../shared/src/types/Temple';
import Participants from './Participants';

const LoadingView = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const Spotlight = styled.View({
  aspectRatio: '0.85',
});

const SpotlightVideo = styled.View({
  flex: 1,
});

const MainViewContainer = styled.View({
  flex: 1,
});

const Controls = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

const DailyMediaViewWrapper = styled(DailyMediaView)({
  height: '100%',
  width: '100%',
});

const TouchableMediaView = ({
  onPress,
  item,
}: {
  onPress: () => void;
  item: DailyParticipant;
}) => (
  <TouchableOpacity onPress={onPress}>
    <DailyMediaViewWrapper
      videoTrack={item.videoTrack ?? null}
      audioTrack={item.audioTrack ?? null}
      objectFit={'cover'}
      zOrder={item.local ? 1 : 0}
      mirror={item.local}
    />
  </TouchableOpacity>
);

const Content = ({state}: {state: Temple}) => (
  <B1>{JSON.stringify(state, null, 2)}</B1>
);

const Session = () => {
  const {
    joinMeeting,
    leaveMeeting,
    toggleAudio,
    toggleVideo,
    hasAudio,
    hasVideo,
  } = useContext(DailyContext);
  const {
    params: {templeId},
  } = useRoute<RouteProp<ScreenProps, 'Temple'>>();

  const {goBack} = useNavigation();
  const {subscribeTemple} = useTemple();

  const temple = useRecoilValue(templeAtom);
  const participants = useRecoilValue(participantsSelector);
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));
  const selectedParticipant = useRecoilValue(selectedParticipantSelector);
  const setSelectedParticipantId = useSetRecoilState(selectedParticipantIdAtom);

  useEffect(() => {
    if (temple?.url) {
      joinMeeting(temple.url);
    }
  }, [temple?.url, joinMeeting]);

  useEffect(() => {
    const unsubscribe = subscribeTemple(templeId);
    return unsubscribe;
  }, [subscribeTemple, templeId]);

  const exitMeeting = async () => {
    await leaveMeeting();
    goBack();
  };

  if (isLoading) {
    return (
      <LoadingView>
        <ActivityIndicator size="large" color={COLORS.BLACK} />
      </LoadingView>
    );
  }

  return (
    <MainViewContainer>
      <Spotlight>
        {temple?.active && !selectedParticipant && <Content state={temple} />}
        {selectedParticipant && (
          <SpotlightVideo>
            <TouchableMediaView
              onPress={() => setSelectedParticipantId(null)}
              item={selectedParticipant}
            />
          </SpotlightVideo>
        )}
      </Spotlight>
      {participants && (
        <Participants participants={participants} localAudioOn={hasAudio} />
      )}
      <Spacer16 />
      <Controls>
        <AudioToggleButton onPress={toggleAudio} active={hasAudio} />
        <Spacer12 />
        <VideoToggleButton onPress={toggleVideo} active={hasVideo} />
        <Spacer12 />
        <LeaveButton onPress={exitMeeting} />
      </Controls>
      <Spacer16 />
    </MainViewContainer>
  );
};

export default Session;
