import React, {useContext, useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
  DailyMediaView,
  DailyEventObject,
} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';

import {DailyContext} from './DailyProvider';
import {
  selectedParticipantId,
  videoSharingFields,
  participantsAtom,
  participantsSelector,
} from './state/state';
import Button from '../../common/components/Buttons/Button';
import {Spacer12, TopSafeArea} from '../../common/components/Spacers/Spacer';
import {SPACINGS} from '../../common/constants/spacings';

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
  justifyContent: 'space-between',
  margin: SPACINGS.SIXTEEN,
});

const SpotlightVideo = styled.View({
  width: '100%',
  height: '50%',
});

const Participants = styled.View({
  width: '25%',
  backgroundColor: 'darksalmon',
});

const style = StyleSheet.create({
  video: {height: '100%', width: '100%'},
});

const renderVideo = ({item}: DailyEventObject) => (
  <VideoView>
    <DailyMediaView
      videoTrack={item.videoTrack ?? null}
      audioTrack={item.audioTrack ?? null}
      objectFit={'cover'}
      zOrder={item.local ? 1 : 0}
      mirror={item.local}
      style={style.video}
    />
  </VideoView>
);

const Session = () => {
  const {prepareMeeting, leaveMeeting, startMeeting} = useContext(DailyContext);

  const participantsObj = useRecoilValue(participantsAtom);
  const participants = useRecoilValue(participantsSelector);
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));
  const [spotlightParticipantId, setSelectedParticipantId] = useRecoilState(
    selectedParticipantId,
  );
  const selectedParticipant = spotlightParticipantId
    ? participantsObj[spotlightParticipantId]
    : null;

  useEffect(() => {
    prepareMeeting();
  }, [prepareMeeting]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <>
      <TopSafeArea />
      <ScreenView>
        <Spotlight>
          <SpotlightVideo>
            {selectedParticipant && (
              <TouchableOpacity onPress={() => setSelectedParticipantId(null)}>
                <DailyMediaView
                  videoTrack={selectedParticipant.videoTrack ?? null}
                  audioTrack={selectedParticipant.audioTrack ?? null}
                  objectFit={'cover'}
                  zOrder={selectedParticipant.local ? 1 : 0}
                  mirror={selectedParticipant.local}
                  style={style.video}
                />
              </TouchableOpacity>
            )}
          </SpotlightVideo>
          {participants.length === 0 ? (
            <Button onPress={startMeeting}>Start Meeting</Button>
          ) : (
            <Button onPress={leaveMeeting}>Leave Meeting</Button>
          )}
        </Spotlight>
        <Participants>
          <FlatList
            data={participants}
            keyExtractor={participant => participant.user_id}
            ItemSeparatorComponent={Spacer12}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => setSelectedParticipantId(item.user_id)}>
                <VideoView>
                  <DailyMediaView
                    videoTrack={item.videoTrack ?? null}
                    audioTrack={item.audioTrack ?? null}
                    objectFit={'cover'}
                    zOrder={item.local ? 1 : 0}
                    mirror={item.local}
                    style={style.video}
                  />
                </VideoView>
              </TouchableOpacity>
            )}
          />
        </Participants>
      </ScreenView>
    </>
  );
};

export default Session;
