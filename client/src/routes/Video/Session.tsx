import {useContext, useEffect} from 'react';
import {ActivityIndicator, Text, View, StyleSheet} from 'react-native';
import {useRecoilValue} from 'recoil';
import {
  DailyMediaView,
  DailyParticipant,
} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';

import React from 'react';
import {DailyContext} from './DailyProvider';
import {videoSharingFields, videoSharingParticipantsAtom} from './state/state';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {complement, isNil, o, values} from 'ramda';
import Button from '../../common/components/Buttons/Button';
// import Button from '../../common/components/Buttons/Button';

const VideoView = styled.View`
  height: 100px;
  width: 100px;
  background-color: green;
`;

const ScreenView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const style = StyleSheet.create({
  video: {height: '100%', width: '100%'},
});

const Session = () => {
  const {call, prepareMeeting, leaveMeeting, startMeeting} =
    useContext(DailyContext);

  const participants = values(useRecoilValue(videoSharingParticipantsAtom));
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));

  useEffect(() => {
    prepareMeeting();
  }, [prepareMeeting]);

  useEffect(() => {
    return leaveMeeting;
  }, [leaveMeeting]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (participants.length === 0) {
    return (
      <ScreenView>
        <Button title="Start Meeting" onPress={startMeeting} />
      </ScreenView>
    );
  }

  console.log('************************', participants.length);

  return (
    <ScreenView>
      {participants.map(({user_id, videoTrack, audioTrack}) => (
        <VideoView key={user_id}>
          <DailyMediaView
            videoTrack={videoTrack ?? null}
            audioTrack={audioTrack ?? null}
            objectFit={'cover'}
            zOrder={user_id === 'local' ? 1 : 0}
            mirror={user_id === 'local'}
            style={style.video}
          />
        </VideoView>
      ))}
      <Button title="Leave Meeting" onPress={leaveMeeting} />
    </ScreenView>
  );
};

export default Session;
