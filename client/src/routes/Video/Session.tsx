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

const Session = () => {
  const {prepareMeeting, leaveMeeting, startMeeting} = useContext(DailyContext);

  const participants = useRecoilValue(participantsSelector);
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));
  const selectedParticipant = useRecoilValue(selectedParticipantSelector);
  const setSelectedParticipantId = useSetRecoilState(selectedParticipantId);

  useEffect(() => {
    prepareMeeting();
  }, [prepareMeeting]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
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
        <Spotlight>
          <SpotlightVideo>
            {selectedParticipant && (
              <TouchableMediaView
                onPress={() => setSelectedParticipantId(null)}
                item={selectedParticipant}
              />
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
            renderItem={renderVideo}
          />
        </Participants>
      </ScreenView>
    </>
  );
};

export default Session;
