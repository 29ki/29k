import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  DailyMediaView,
  DailyParticipant,
} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';

import {
  selectedParticipantId,
  videoSharingFields,
  participantsSelector,
  selectedParticipantSelector,
  templeAtom,
} from './state/state';
import {RouteProp, useRoute} from '@react-navigation/native';

import {Spacer16, Spacer28} from '../../common/components/Spacers/Spacer';
import {SPACINGS} from '../../common/constants/spacings';
import AudioToggleButton from './Buttons/AudioToggleButton';
import VideoToggleButton from './Buttons/VideoToggleButton';
import {COLORS} from '../../common/constants/colors';
import MeetingToggleButton from './Buttons/MeetingToggleButton';
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
  flexGrow: 2,
  margin: SPACINGS.SIXTEEN,
});

const SpotlightVideo = styled.View({
  width: '100%',
  height: '50%',
});

const MainViewContainer = styled.View({
  flex: 1,
});

const Controls = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
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
    prepareMeeting,
    leaveMeeting,
    startMeeting,
    toggleAudio,
    toggleVideo,
    hasAudio,
    hasVideo,
  } = useContext(DailyContext);
  const {
    params: {templeId},
  } = useRoute<RouteProp<ScreenProps, 'Temple'>>();

  const {subscribeTemple} = useTemple();

  const temple = useRecoilValue(templeAtom);
  const participants = useRecoilValue(participantsSelector);
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));
  const isJoined = useRecoilValue(videoSharingFields('isJoined'));
  const selectedParticipant = useRecoilValue(selectedParticipantSelector);
  const setSelectedParticipantId = useSetRecoilState(selectedParticipantId);

  useEffect(() => {
    if (temple?.url) {
      prepareMeeting(temple.url);
    }
  }, [temple?.url, prepareMeeting]);

  useEffect(() => {
    const unsubscribe = subscribeTemple(templeId);
    return unsubscribe;
  }, [prepareMeeting, subscribeTemple, templeId]);

  useEffect(() => {
    if (!isJoined) {
      return;
    }
    return leaveMeeting;
  }, [isJoined, leaveMeeting]);

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
        <Participants participants={participants} hasAudio={hasAudio} />
      )}
      <Spacer16 />
      <Controls>
        <AudioToggleButton onPress={toggleAudio} active={hasAudio} />
        <VideoToggleButton onPress={toggleVideo} active={hasVideo} />
        <MeetingToggleButton
          onPress={participants.length === 0 ? startMeeting : leaveMeeting}
          active={participants.length === 0}
        />
      </Controls>
      <Spacer28 />
    </MainViewContainer>
  );
};

export default Session;
