import {useContext, useEffect} from 'react';
import {ActivityIndicator, StyleSheet, FlatList} from 'react-native';
import {useRecoilValue} from 'recoil';
import {DailyMediaView} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';

import React from 'react';
import {DailyContext} from './DailyProvider';
import {
  videoSharingFields,
  videoSharingParticipantsSelector,
} from './state/state';
import Button from '../../common/components/Buttons/Button';
import {Spacer12, TopSafeArea} from '../../common/components/Spacers/Spacer';

const VideoView = styled.View({
  aspectRatio: '1',
  backgroundColor: 'gray',
});

const ScreenView = styled.View({
  flex: 1,
  flexDirection: 'row',
});

const Spotlight = styled.View({flexGrow: 2});

const Participants = styled.View({
  width: '25%',
  backgroundColor: 'darksalmon',
});

const style = StyleSheet.create({
  video: {height: '100%', width: '100%'},
});

const Session = () => {
  const {prepareMeeting, leaveMeeting, startMeeting} = useContext(DailyContext);

  const participants = useRecoilValue(videoSharingParticipantsSelector);
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));

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
          {participants.length === 0 ? (
            <Button title="Start Meeting" onPress={startMeeting} />
          ) : (
            <Button title="Leave Meeting" onPress={leaveMeeting} />
          )}
        </Spotlight>
        <Participants>
          <FlatList
            data={participants}
            keyExtractor={participant => participant.user_id}
            ItemSeparatorComponent={Spacer12}
            renderItem={({item}) => (
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
            )}
          />
        </Participants>
      </ScreenView>
    </>
  );
};

export default Session;
