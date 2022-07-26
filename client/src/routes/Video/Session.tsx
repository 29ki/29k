import React, {useContext, useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  DailyMediaView,
  DailyParticipant,
} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';

import {DailyContext} from './DailyProvider';
import {
  selectedParticipantId,
  videoSharingFields,
  participantsSelector,
  selectedParticipantSelector,
} from './state/state';

import useLiveContent from '../../lib/liveContent/hooks/useLiveContent';

import {
  Spacer12,
  Spacer16,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {SPACINGS} from '../../common/constants/spacings';
import AudioToggleButton from './Buttons/AudioToggleButton';
import VideoToggleButton from './Buttons/VideoToggleButton';
import {COLORS} from '../../common/constants/colors';
import MeetingToggleButton from './Buttons/MeetingToggleButton';
import {B1} from '../../common/components/Typography/Text/Text';
import {LiveContentState} from '../../lib/liveContent/state/state';

const LoadingView = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const VideoView = styled.View({
  aspectRatio: '1',
  backgroundColor: 'gray',
});

const ScreenView = styled.View({
  flex: 1,
  flexDirection: 'row',
});

const Spotlight = styled.View({
  flexGrow: 2,
  margin: SPACINGS.SIXTEEN,
});

const SpotlightVideo = styled.View({
  width: '100%',
  height: '50%',
});

const Participants = styled.View({
  width: '25%',
  borderLeftWidth: 1,
  borderLeftColor: COLORS.BLACK,
  borderLeftStyle: 'solid',
});

const MainViewContainer = styled.View({
  flex: 1,
});

const Controls = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const style = StyleSheet.create({
  video: {height: '100%', width: '100%'},
});

const TouchableMediaView = ({
  onPress,
  item,
}: {
  onPress: () => void;
  item: DailyParticipant;
}) => (
  <TouchableOpacity onPress={onPress}>
    <DailyMediaView
      videoTrack={item.videoTrack ?? null}
      audioTrack={item.audioTrack ?? null}
      objectFit={'cover'}
      zOrder={item.local ? 1 : 0}
      mirror={item.local}
      style={style.video}
    />
  </TouchableOpacity>
);

const Content = ({state}: {state: LiveContentState}) => (
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
  const liveContentState = useLiveContent('OORlVPO4sreTKl9E2G2r');

  const participants = useRecoilValue(participantsSelector);
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));
  const selectedParticipant = useRecoilValue(selectedParticipantSelector);
  const setSelectedParticipantId = useSetRecoilState(selectedParticipantId);

  useEffect(() => {
    prepareMeeting();
  }, [prepareMeeting]);

  if (isLoading) {
    return (
      <LoadingView>
        <ActivityIndicator size="large" color={COLORS.BLACK} />
      </LoadingView>
    );
  }

  const renderVideo = ({item}: ListRenderItemInfo<DailyParticipant>) => (
    <VideoView>
      <TouchableMediaView
        onPress={() => setSelectedParticipantId(item.user_id)}
        item={item}
      />
    </VideoView>
  );

  return (
    <>
      <TopSafeArea />
      <ScreenView>
        <MainViewContainer>
          <Spotlight>
            {liveContentState.active && !selectedParticipant && (
              <Content state={liveContentState} />
            )}
            {selectedParticipant && (
              <SpotlightVideo>
                <TouchableMediaView
                  onPress={() => setSelectedParticipantId(null)}
                  item={selectedParticipant}
                />
              </SpotlightVideo>
            )}
          </Spotlight>
          <Controls>
            <AudioToggleButton onPress={toggleAudio} active={hasAudio} />
            <VideoToggleButton onPress={toggleVideo} active={hasVideo} />
            <MeetingToggleButton
              onPress={participants.length === 0 ? startMeeting : leaveMeeting}
              active={participants.length === 0}
            />
          </Controls>
          <Spacer16 />
        </MainViewContainer>
        <Participants>
          <FlatList
            data={participants}
            keyExtractor={participant => participant.user_id}
            ItemSeparatorComponent={Spacer12}
            renderItem={renderVideo}
          />
        </Participants>
      </ScreenView>
    </>
  );
};

export default Session;
